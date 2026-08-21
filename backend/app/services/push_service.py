"""Delivering notifications to the phone's notification tray via FCM.

Everything here is best-effort. A notification is already saved to
system_notifications before this runs, so the in-app alerts list stays correct
even when a send fails, and no push failure is ever allowed to break the
request that triggered it.

Sending needs a real Firebase service account - unlike verifying an ID token,
there is no credential-free route - so on a deploy without one this logs the
reason once and does nothing.
"""

import logging
import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.device_token import DeviceToken
from app.models.user import User
from app.services.firebase_auth import FirebaseAuthService

logger = logging.getLogger(__name__)

_warned_unconfigured = False


def register_device(
    db: Session, user: User, token: str, platform: str = "android"
) -> None:
    """Point a token at the signed-in user, creating or reassigning its row."""
    row = db.scalar(select(DeviceToken).where(DeviceToken.token == token))

    if row is None:
        db.add(DeviceToken(user_id=user.id, token=token, platform=platform))
    else:
        # Same token, possibly a different account: a shared or resold phone.
        row.user_id = user.id
        row.platform = platform
        row.last_seen_at = func.now()

    db.commit()


def unregister_device(db: Session, user: User, token: str) -> None:
    """Remove a token, but only from the account that owns it."""
    db.query(DeviceToken).filter(
        DeviceToken.token == token, DeviceToken.user_id == user.id
    ).delete(synchronize_session=False)
    db.commit()


def _send(db: Session, tokens: list[str], title: str, body: str, category: str) -> None:
    """Deliver to every token, then drop the ones FCM says are dead."""
    global _warned_unconfigured

    if not tokens:
        return

    if not FirebaseAuthService.has_service_account():
        if not _warned_unconfigured:
            _warned_unconfigured = True
            logger.warning(
                "Push skipped: sending through FCM needs a Firebase service account. "
                "Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to switch it on."
            )
        return

    from firebase_admin import messaging

    try:
        response = messaging.send_each_for_multicast(
            messaging.MulticastMessage(
                tokens=tokens,
                notification=messaging.Notification(title=title, body=body),
                # The tap handler reads this to open the right page.
                data={"category": category or "general"},
                # No channel_id on purpose. Android silently discards a
                # notification aimed at a channel that does not exist, and a
                # phone running an older build has no faidafarm_default yet.
                # The manifest names it as the default, so the app's own
                # channel is used where it exists and FCM falls back where it
                # does not - delivery never depends on the client being current.
                android=messaging.AndroidConfig(priority="high"),
            )
        )
    except Exception:  # noqa: BLE001 - never fail the caller's request over a push
        logger.exception("[push] send failed for %d token(s)", len(tokens))
        return

    dead = [
        tokens[index]
        for index, result in enumerate(response.responses)
        if not result.success
        and isinstance(
            result.exception,
            (messaging.UnregisteredError, messaging.SenderIdMismatchError),
        )
    ]

    if dead:
        # Uninstalled apps keep their rows forever otherwise, and every later
        # send wastes a call on a token that can never be delivered to.
        db.query(DeviceToken).filter(DeviceToken.token.in_(dead)).delete(
            synchronize_session=False
        )
        db.commit()
        logger.info("[push] pruned %d dead token(s)", len(dead))

    if response.failure_count:
        logger.warning(
            "[push] %d/%d deliveries failed", response.failure_count, len(tokens)
        )


def send_to_user(
    db: Session, user_id: uuid.UUID, title: str, body: str, category: str = "general"
) -> None:
    """Push a notification to every phone that user is signed in on."""
    tokens = list(db.scalars(select(DeviceToken.token).where(DeviceToken.user_id == user_id)))
    _send(db, tokens, title, body, category)


def send_broadcast(db: Session, title: str, body: str, category: str = "general") -> None:
    """Push a notification meant for everyone.

    This mirrors what the alerts list shows: a system_notifications row with no
    user_id is visible to every account, so every registered device gets it.
    """
    tokens = list(db.scalars(select(DeviceToken.token)))
    _send(db, tokens, title, body, category)
