from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ConsentRecordCreate(BaseModel):
    household_id: UUID | None = None
    subject_name: str | None = None
    consent_type: str
    consent_given: bool = False
    consented_at: datetime | None = None
    notes: str | None = None


class ConsentRecordRead(ConsentRecordCreate):
    id: UUID
    recorded_by_id: UUID | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SupervisorReviewCreate(BaseModel):
    target_type: str
    target_id: UUID
    status: str = "pending"
    notes: str | None = None


class SupervisorReviewRead(SupervisorReviewCreate):
    id: UUID
    reviewer_id: UUID | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class DataQualityFlagCreate(BaseModel):
    target_type: str
    target_id: UUID
    severity: str = "medium"
    code: str
    message: str


class DataQualityFlagRead(DataQualityFlagCreate):
    id: UUID
    status: str
    raised_by_id: UUID | None
    resolved_at: datetime | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SafeguardingReferralCreate(BaseModel):
    household_id: UUID | None = None
    referral_type: str
    priority: str = "normal"
    summary: str
    assigned_to_id: UUID | None = None


class SafeguardingReferralRead(SafeguardingReferralCreate):
    id: UUID
    status: str
    created_by_id: UUID | None
    closed_at: datetime | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ExportJobCreate(BaseModel):
    export_type: str
    format: str = "csv"
    filters: dict | None = None


class ExportJobRead(ExportJobCreate):
    id: UUID
    requested_by_id: UUID | None
    status: str
    file_url: str | None
    error_message: str | None
    created_at: datetime
    completed_at: datetime | None
    model_config = ConfigDict(from_attributes=True)


class SystemNotificationRead(BaseModel):
    id: UUID
    user_id: UUID | None
    title: str
    message: str
    category: str
    read_at: datetime | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SystemNotificationCreate(BaseModel):
    user_id: UUID | None = None
    title: str
    message: str
    category: str


class MediaAssetCreate(BaseModel):
    related_type: str | None = None
    related_id: UUID | None = None
    media_type: str
    file_name: str | None = None
    content_type: str | None = None
    storage_url: str | None = None
    checksum: str | None = None
    size_bytes: int | None = None
    metadata_json: dict | None = None


class MediaAssetRead(MediaAssetCreate):
    id: UUID
    owner_id: UUID | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SettingRead(BaseModel):
    id: UUID
    key: str
    value: dict
    description: str | None = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SettingUpsert(BaseModel):
    key: str
    value: dict
    description: str | None = None


class CountyConfigurationCreate(BaseModel):
    county: str
    site_code: str | None = None
    site_name: str | None = None
    is_active: bool = True
    metadata_json: dict | None = None


class CountyConfigurationRead(CountyConfigurationCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FeatureFlagRead(BaseModel):
    id: UUID
    key: str
    enabled: bool
    description: str | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FeatureFlagUpsert(BaseModel):
    key: str
    enabled: bool
    description: str | None = None


class KoboProjectConfigCreate(BaseModel):
    project_id: str
    name: str | None = None
    form_type: str | None = None
    is_active: bool = True
    metadata_json: dict | None = None


class KoboProjectConfigRead(KoboProjectConfigCreate):
    id: UUID
    last_synced_at: datetime | None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
