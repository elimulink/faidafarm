from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.operations import SystemNotification
from app.models.role import UserRole
from app.models.user import User


def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> User | None:
    return db.scalar(select(User).where(User.firebase_uid == firebase_uid))


def get_or_create_user_from_firebase(db: Session, decoded_token: dict) -> User:
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise ValueError("Decoded Firebase token is missing uid.")

    user = get_user_by_firebase_uid(db, firebase_uid)
    if user:
        return user

    user = User(
        firebase_uid=firebase_uid,
        email=decoded_token.get("email"),
        phone=decoded_token.get("phone_number"),
        full_name=decoded_token.get("name"),
        role=UserRole.FARMER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    welcome_user(db, user)
    return user


def welcome_user(db: Session, user: User) -> None:
    """Greet a newly created account, once.

    A first name reads like a greeting where a full name reads like a form, so
    the first word is used when there is one. Borrowed from MUCO, which does the
    same on signup.

    The notification is saved before it is pushed, which matters here more than
    usual: the phone registers for notifications a moment AFTER this runs, so
    the very first account often has no device to push to yet. The greeting is
    waiting in Alerts regardless, and any device already registered still buzzes.
    """
    name = (user.full_name or "").strip().split(" ")[0] or "there"
    title = "Welcome to FaidaFarm"
    message = (
        f"Karibu {name}. Add the crops you grow and FaidaFarm will match today's "
        "prices, weather and buyers to them - and tell you when it is worth selling."
    )

    db.add(
        SystemNotification(
            user_id=user.id,
            title=title,
            message=message,
            category="welcome",
        )
    )
    db.commit()

    # Imported here rather than at module scope: push_service imports the auth
    # service, which imports settings, and a cycle through users.py would break
    # startup for a courtesy notification.
    from app.services import push_service

    push_service.send_to_user(db, user.id, title, message, "welcome")
