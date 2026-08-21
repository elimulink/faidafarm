"""Proving a Firebase ID token is genuine.

There are two routes, because the stronger one needs a secret the deploy may
not have:

  With a service account - firebase_admin, which additionally asks Firebase
      whether the token has been revoked since it was issued.
  Without one            - google-auth checks the signature against the same
      public certificates Firebase signs with. The token is still proven to be
      genuine, unexpired, and minted for this project; only the revocation
      question goes unasked, so a revoked token stays usable until it expires.

Both routes authenticate the caller. The credential-free one exists so that a
deploy missing the key has working sign-in rather than a 401 on every request,
and it upgrades itself the moment a service account appears.
"""

import json
import logging
import os
import threading

import firebase_admin
import google.auth.transport.requests
from fastapi import HTTPException, status
from firebase_admin import auth, credentials
from firebase_admin.auth import ExpiredIdTokenError, InvalidIdTokenError, RevokedIdTokenError
from google.auth.exceptions import GoogleAuthError
from google.oauth2 import id_token as google_id_token

from app.core.config import settings

logger = logging.getLogger(__name__)

_ISSUER_PREFIX = "https://securetoken.google.com/"


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def _service_account_credential() -> credentials.Certificate | None:
    """The service account, from the environment or from disk, if either has one."""
    raw = settings.FIREBASE_SERVICE_ACCOUNT_JSON
    if raw:
        try:
            return credentials.Certificate(json.loads(raw))
        except (ValueError, TypeError) as exc:
            logger.warning("FIREBASE_SERVICE_ACCOUNT_JSON is not usable service account JSON: %s", exc)

    path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not path:
        return None

    if not os.path.isfile(path):
        # Worth saying plainly: this is the usual cause of a deploy that has the
        # variable set but never uploaded the file it names.
        logger.warning("GOOGLE_APPLICATION_CREDENTIALS names %s, which does not exist.", path)
        return None

    try:
        return credentials.Certificate(path)
    except (ValueError, IOError) as exc:
        logger.warning("The file at %s is not a usable service account: %s", path, exc)
        return None


class FirebaseAuthService:
    _lock = threading.Lock()
    _admin_ready: bool | None = None

    @staticmethod
    def initialize() -> None:
        """Prepare whichever verification route this deploy can use."""
        FirebaseAuthService._has_admin()

    @staticmethod
    def _has_admin() -> bool:
        """True when firebase_admin is holding a real service account."""
        if FirebaseAuthService._admin_ready is not None:
            return FirebaseAuthService._admin_ready

        with FirebaseAuthService._lock:
            if FirebaseAuthService._admin_ready is not None:
                return FirebaseAuthService._admin_ready

            if firebase_admin._apps:
                FirebaseAuthService._admin_ready = True
                return True

            credential = _service_account_credential()
            if credential is None:
                logger.warning(
                    "No Firebase service account found. ID tokens will be verified against "
                    "Google's public certificates; revoked tokens stay valid until they expire."
                )
                FirebaseAuthService._admin_ready = False
                return False

            options = {}
            if settings.FIREBASE_PROJECT_ID:
                options["projectId"] = settings.FIREBASE_PROJECT_ID

            try:
                firebase_admin.initialize_app(credential, options)
            except Exception as exc:
                logger.exception("Firebase Admin initialization failed", exc_info=exc)
                FirebaseAuthService._admin_ready = False
                return False

            FirebaseAuthService._admin_ready = True
            return True

    @staticmethod
    def _verify_against_public_certificates(id_token: str) -> dict:
        project_id = settings.FIREBASE_PROJECT_ID
        if not project_id:
            # Without the project id there is nothing to check the audience
            # against, and a token from any Firebase project would pass.
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firebase authentication is not configured.",
            )

        try:
            claims = google_id_token.verify_firebase_token(
                id_token,
                google.auth.transport.requests.Request(),
                audience=project_id,
            )
        except GoogleAuthError as exc:
            logger.info("Firebase ID token rejected: %s", exc)
            raise _unauthorized("Invalid Firebase ID token.") from exc
        except Exception as exc:
            logger.warning("Firebase ID token could not be checked: %s", exc)
            raise _unauthorized("Could not verify Firebase ID token.") from exc

        if not claims:
            raise _unauthorized("Invalid Firebase ID token.")

        # verify_firebase_token settles the signature, audience and expiry. The
        # issuer is ours to check, and it is what ties the token to this project.
        if claims.get("iss") != f"{_ISSUER_PREFIX}{project_id}":
            raise _unauthorized("Firebase ID token was issued for another project.")

        # firebase_admin reports the subject as "uid"; google-auth leaves it in
        # "sub". Callers read "uid", so give them one either way.
        if not claims.get("uid"):
            claims["uid"] = claims.get("sub")

        if not claims.get("uid"):
            raise _unauthorized("Firebase ID token carries no subject.")

        return claims

    @staticmethod
    async def verify_id_token(id_token: str | None) -> dict:
        if not id_token:
            raise _unauthorized("Missing Firebase ID token.")

        if not FirebaseAuthService._has_admin():
            return FirebaseAuthService._verify_against_public_certificates(id_token)

        try:
            return auth.verify_id_token(id_token, check_revoked=True)
        except ExpiredIdTokenError as exc:
            raise _unauthorized("Firebase ID token has expired.") from exc
        except RevokedIdTokenError as exc:
            raise _unauthorized("Firebase ID token has been revoked.") from exc
        except InvalidIdTokenError as exc:
            raise _unauthorized("Invalid Firebase ID token.") from exc
        except Exception as exc:
            logger.warning("Firebase token verification failed: %s", exc)
            raise _unauthorized("Could not verify Firebase ID token.") from exc
