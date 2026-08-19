from typing import Annotated

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.role import UserRole
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserRead, UserRoleUpdate


router = APIRouter()


@router.get("/", response_model=list[UserRead])
def list_users(
    _: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    db: Annotated[Session, Depends(get_db)],
) -> list[User]:
    return list(db.scalars(select(User).order_by(User.created_at.desc())))


@router.get("/me", response_model=UserRead)
def get_me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/admin-check")
def admin_check(_: Annotated[User, Depends(require_roles(UserRole.ADMIN))]) -> dict[str, bool]:
    return {"admin": True}


@router.patch("/{user_id}/role", response_model=UserRead)
def assign_role(
    user_id: UUID,
    payload: UserRoleUpdate,
    _: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/active", response_model=UserRead)
def set_user_active(
    user_id: UUID,
    is_active: bool,
    _: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user
