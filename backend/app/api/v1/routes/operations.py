from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.operations import (
    DataQualityFlag,
    SafeguardingReferral,
    SupervisorReview,
)
from app.models.role import UserRole
from app.models.user import User
from app.schemas.operations import (
    DataQualityFlagCreate,
    DataQualityFlagRead,
    SafeguardingReferralCreate,
    SafeguardingReferralRead,
    SupervisorReviewCreate,
    SupervisorReviewRead,
)

router = APIRouter()
review_access = require_roles(UserRole.SUPERVISOR, UserRole.ADMIN)
research_access = require_roles(UserRole.RESEARCHER, UserRole.SUPERVISOR, UserRole.ADMIN)
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/reviews", response_model=list[SupervisorReviewRead])
def list_reviews(
    _: Annotated[User, Depends(review_access)],
    db: DbSession,
    status_filter: str | None = Query(None, alias="status"),
    target_type: str | None = None,
    limit: int = Query(50, ge=1, le=100),
) -> list[SupervisorReview]:
    query = select(SupervisorReview)
    if status_filter:
        query = query.where(SupervisorReview.status == status_filter)
    if target_type:
        query = query.where(SupervisorReview.target_type == target_type)
    return list(db.scalars(query.order_by(SupervisorReview.created_at.desc()).limit(limit)))


@router.post("/reviews", response_model=SupervisorReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(payload: SupervisorReviewCreate, current_user: Annotated[User, Depends(review_access)], db: DbSession) -> SupervisorReview:
    review = SupervisorReview(reviewer_id=current_user.id, **payload.model_dump())
    if payload.status != "pending":
        review.reviewed_at = datetime.now(timezone.utc)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/data-quality-flags", response_model=list[DataQualityFlagRead])
def list_data_quality_flags(
    _: Annotated[User, Depends(research_access)],
    db: DbSession,
    status_filter: str | None = Query(None, alias="status"),
    severity: str | None = None,
    limit: int = Query(50, ge=1, le=100),
) -> list[DataQualityFlag]:
    query = select(DataQualityFlag)
    if status_filter:
        query = query.where(DataQualityFlag.status == status_filter)
    if severity:
        query = query.where(DataQualityFlag.severity == severity)
    return list(db.scalars(query.order_by(DataQualityFlag.created_at.desc()).limit(limit)))


@router.post("/data-quality-flags", response_model=DataQualityFlagRead, status_code=status.HTTP_201_CREATED)
def create_data_quality_flag(payload: DataQualityFlagCreate, current_user: Annotated[User, Depends(research_access)], db: DbSession) -> DataQualityFlag:
    flag = DataQualityFlag(raised_by_id=current_user.id, **payload.model_dump())
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return flag


@router.get("/safeguarding-referrals", response_model=list[SafeguardingReferralRead])
def list_safeguarding_referrals(
    _: Annotated[User, Depends(research_access)],
    db: DbSession,
    status_filter: str | None = Query(None, alias="status"),
    priority: str | None = None,
    limit: int = Query(50, ge=1, le=100),
) -> list[SafeguardingReferral]:
    query = select(SafeguardingReferral)
    if status_filter:
        query = query.where(SafeguardingReferral.status == status_filter)
    if priority:
        query = query.where(SafeguardingReferral.priority == priority)
    return list(db.scalars(query.order_by(SafeguardingReferral.created_at.desc()).limit(limit)))


@router.post("/safeguarding-referrals", response_model=SafeguardingReferralRead, status_code=status.HTTP_201_CREATED)
def create_safeguarding_referral(payload: SafeguardingReferralCreate, current_user: Annotated[User, Depends(get_current_user)], db: DbSession) -> SafeguardingReferral:
    referral = SafeguardingReferral(created_by_id=current_user.id, **payload.model_dump())
    db.add(referral)
    db.commit()
    db.refresh(referral)
    return referral
