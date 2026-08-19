import logging

import firebase_admin
from fastapi import HTTPException, status
from firebase_admin import auth, credentials
from firebase_admin.auth import ExpiredIdTokenError, InvalidIdTokenError, RevokedIdTokenError

from app.core.config import settings

logger = logging.getLogger(__name__)


class FirebaseAuthService:
    _initialized = False

    @staticmethod
    def initialize() -> None:
        if firebase_admin._apps:
            FirebaseAuthService._initialized = True
            return

        try:
            options = {}
            if settings.FIREBASE_PROJECT_ID:
                options["projectId"] = settings.FIREBASE_PROJECT_ID
            firebase_admin.initialize_app(credentials.ApplicationDefault(), options)
            FirebaseAuthService._initialized = True
        except Exception as exc:
            logger.exception("Firebase Admin initialization failed", exc_info=exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firebase authentication is not configured.",
            ) from exc

    @staticmethod
    async def verify_id_token(id_token: str | None) -> dict:
        if not id_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Firebase ID token.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        FirebaseAuthService.initialize()
        try:
            return auth.verify_id_token(id_token, check_revoked=True)
        except ExpiredIdTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase ID token has expired.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
        except RevokedIdTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Firebase ID token has been revoked.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
        except InvalidIdTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase ID token.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
        except Exception as exc:
            logger.warning("Firebase token verification failed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not verify Firebase ID token.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
