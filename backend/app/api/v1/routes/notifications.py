from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.operations import SystemNotification
from app.models.role import UserRole
from app.models.user import User
from app.schemas.operations import SystemNotificationCreate, SystemNotificationRead

router = APIRouter()


@router.get("/", response_model=list[SystemNotificationRead])
def list_notifications(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    unread_only: bool = False,
    limit: int = Query(50, ge=1, le=100),
) -> list[SystemNotification]:
    query = select(SystemNotification).where(
        (SystemNotification.user_id == current_user.id) | (SystemNotification.user_id.is_(None))
    )
    if unread_only:
        query = query.where(SystemNotification.read_at.is_(None))
    return list(db.scalars(query.order_by(SystemNotification.created_at.desc()).limit(limit)))


@router.post("/", response_model=SystemNotificationRead, status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: SystemNotificationCreate,
    _: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.SUPERVISOR))],
    db: Annotated[Session, Depends(get_db)],
) -> SystemNotification:
    notification = SystemNotification(**payload.model_dump())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.patch("/{notification_id}/read", response_model=SystemNotificationRead)
def mark_notification_read(
    notification_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> SystemNotification:
    notification = db.get(SystemNotification, notification_id)
    if notification is None or notification.user_id not in {None, current_user.id}:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    notification.read_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(notification)
    return notification
