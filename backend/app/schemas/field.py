from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FieldQuestionCreate(BaseModel):
    prompt: str
    question_type: str
    required: bool = False
    sort_order: int = 0
    options: dict | None = None


class FieldQuestionRead(FieldQuestionCreate):
    id: UUID
    form_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FieldFormCreate(BaseModel):
    title: str
    description: str | None = None
    version: int = 1
    is_active: bool = True
    questions: list[FieldQuestionCreate] = Field(default_factory=list)


class FieldFormRead(BaseModel):
    id: UUID
    title: str
    description: str | None
    version: int
    is_active: bool
    created_by_id: UUID | None
    created_at: datetime
    updated_at: datetime
    questions: list[FieldQuestionRead] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


class SubmissionAnswerCreate(BaseModel):
    question_id: UUID | None = None
    answer_value: dict | None = None


class SubmissionMediaCreate(BaseModel):
    media_type: str
    file_name: str | None = None
    storage_url: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    captured_at: datetime | None = None


class FieldSubmissionCreate(BaseModel):
    form_id: UUID
    client_submission_id: str | None = None
    status: str = "draft"
    county: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    answers: list[SubmissionAnswerCreate] = Field(default_factory=list)
    media: list[SubmissionMediaCreate] = Field(default_factory=list)


class FieldSubmissionRead(BaseModel):
    id: UUID
    form_id: UUID
    submitted_by_id: UUID
    client_submission_id: str | None
    status: str
    review_status: str
    county: str | None
    latitude: float | None
    longitude: float | None
    submitted_at: datetime | None
    synced_at: datetime | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class DeviceRegistrationCreate(BaseModel):
    device_uid: str
    device_name: str | None = None
    platform: str | None = None


class DeviceRegistrationRead(DeviceRegistrationCreate):
    id: UUID
    user_id: UUID
    last_seen_at: datetime | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SyncQueueRead(BaseModel):
    id: UUID
    user_id: UUID
    submission_id: UUID | None
    operation: str
    status: str
    attempts: int
    last_error: str | None
    queued_at: datetime
    processed_at: datetime | None
    model_config = ConfigDict(from_attributes=True)
