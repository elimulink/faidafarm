from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.security import require_roles
from app.models.field import DeviceRegistration, FieldForm, FieldQuestion, FieldSubmission, SubmissionAnswer, SubmissionMedia, SyncQueue
from app.models.role import UserRole
from app.models.user import User
from app.schemas.field import DeviceRegistrationCreate, DeviceRegistrationRead, FieldFormCreate, FieldFormRead, FieldSubmissionCreate, FieldSubmissionRead, SyncQueueRead

field_access = require_roles(UserRole.FIELD_OFFICER, UserRole.SUPERVISOR, UserRole.ADMIN)
router = APIRouter(dependencies=[Depends(field_access)])
CurrentFieldUser = Annotated[User, Depends(field_access)]
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/forms", response_model=list[FieldFormRead])
def list_forms(db: DbSession, active_only: bool = True, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[FieldForm]:
    query = select(FieldForm).options(selectinload(FieldForm.questions))
    if active_only:
        query = query.where(FieldForm.is_active.is_(True))
    return list(db.scalars(query.order_by(FieldForm.updated_at.desc()).offset(offset).limit(limit)))


@router.post("/forms", response_model=FieldFormRead, status_code=status.HTTP_201_CREATED)
def create_form(payload: FieldFormCreate, current_user: CurrentFieldUser, db: DbSession) -> FieldForm:
    form_data = payload.model_dump(exclude={"questions"})
    form = FieldForm(created_by_id=current_user.id, **form_data)
    form.questions = [FieldQuestion(**question.model_dump()) for question in payload.questions]
    db.add(form)
    db.commit()
    db.refresh(form)
    return db.scalar(select(FieldForm).options(selectinload(FieldForm.questions)).where(FieldForm.id == form.id))


@router.get("/submissions", response_model=list[FieldSubmissionRead])
def list_submissions(current_user: CurrentFieldUser, db: DbSession, status_filter: str | None = Query(None, alias="status"), limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[FieldSubmission]:
    query = select(FieldSubmission)
    if current_user.role == UserRole.FIELD_OFFICER:
        query = query.where(FieldSubmission.submitted_by_id == current_user.id)
    if status_filter:
        query = query.where(FieldSubmission.status == status_filter)
    return list(db.scalars(query.order_by(FieldSubmission.created_at.desc()).offset(offset).limit(limit)))


@router.post("/submissions", response_model=FieldSubmissionRead, status_code=status.HTTP_201_CREATED)
def create_submission(payload: FieldSubmissionCreate, current_user: CurrentFieldUser, db: DbSession) -> FieldSubmission:
    submission_data = payload.model_dump(exclude={"answers", "media"})
    if submission_data["status"] in {"queued", "synced"}:
        submission_data["submitted_at"] = datetime.now(timezone.utc)
    submission = FieldSubmission(submitted_by_id=current_user.id, **submission_data)
    submission.answers = [SubmissionAnswer(**answer.model_dump()) for answer in payload.answers]
    submission.media = [SubmissionMedia(**media.model_dump()) for media in payload.media]
    db.add(submission)
    db.flush()
    if submission.status == "queued":
        db.add(SyncQueue(user_id=current_user.id, submission_id=submission.id, operation="submit", status="queued"))
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/devices", response_model=list[DeviceRegistrationRead])
def list_devices(current_user: CurrentFieldUser, db: DbSession) -> list[DeviceRegistration]:
    query = select(DeviceRegistration)
    if current_user.role == UserRole.FIELD_OFFICER:
        query = query.where(DeviceRegistration.user_id == current_user.id)
    return list(db.scalars(query.order_by(DeviceRegistration.last_seen_at.desc().nullslast())))


@router.post("/devices", response_model=DeviceRegistrationRead, status_code=status.HTTP_201_CREATED)
def register_device(payload: DeviceRegistrationCreate, current_user: CurrentFieldUser, db: DbSession) -> DeviceRegistration:
    device = db.scalar(select(DeviceRegistration).where(DeviceRegistration.device_uid == payload.device_uid))
    if device is None:
        device = DeviceRegistration(user_id=current_user.id, **payload.model_dump())
        db.add(device)
    device.last_seen_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(device)
    return device


@router.get("/sync", response_model=list[SyncQueueRead])
def sync_queue(current_user: CurrentFieldUser, db: DbSession, status_filter: str | None = Query(None, alias="status"), limit: int = Query(50, ge=1, le=100)) -> list[SyncQueue]:
    query = select(SyncQueue)
    if current_user.role == UserRole.FIELD_OFFICER:
        query = query.where(SyncQueue.user_id == current_user.id)
    if status_filter:
        query = query.where(SyncQueue.status == status_filter)
    return list(db.scalars(query.order_by(SyncQueue.queued_at.desc()).limit(limit)))
