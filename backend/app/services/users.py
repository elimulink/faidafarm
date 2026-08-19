from sqlalchemy import select
from sqlalchemy.orm import Session

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
    return user
