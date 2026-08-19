from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ResearchSiteRead(BaseModel):
    id: UUID
    name: str
    county: str
    sub_county: str | None
    ward: str | None
    latitude: float | None
    longitude: float | None
    model_config = ConfigDict(from_attributes=True)


class ResearchSiteCreate(BaseModel):
    name: str
    county: str
    sub_county: str | None = None
    ward: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class HouseholdCreate(BaseModel):
    site_id: UUID | None = None
    external_id: str | None = None
    county: str
    sub_county: str | None = None
    ward: str | None = None
    village: str | None = None
    head_name: str | None = None
    phone: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class HouseholdRead(HouseholdCreate):
    id: UUID
    enumerator_id: UUID | None
    kobo_submission_id: str | None
    source: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class HouseholdMemberCreate(BaseModel):
    household_id: UUID
    full_name: str | None = None
    age_years: int | None = None
    gender: str | None = None
    relationship_to_head: str | None = None


class HouseholdMemberRead(HouseholdMemberCreate):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ChildNutritionCreate(BaseModel):
    household_id: UUID
    child_name: str | None = None
    child_age_months: int | None = None
    gender: str | None = None
    county: str | None = None
    diet_diversity_score: int | None = None
    meal_frequency: int | None = None
    notes: str | None = None


class ChildNutritionRead(ChildNutritionCreate):
    id: UUID
    recorded_at: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FMNRPlotCreate(BaseModel):
    household_id: UUID | None = None
    site_id: UUID | None = None
    county: str
    plot_code: str | None = None
    area_acres: Decimal | None = None
    tree_count: int | None = None
    regenerating_stems_count: int | None = None
    adopted_practices: dict | None = None
    is_active: bool = True


class FMNRPlotRead(FMNRPlotCreate):
    id: UUID
    measured_at: datetime
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class EnumeratorActivityCreate(BaseModel):
    county: str | None = None
    activity_type: str
    description: str | None = None
    records_count: int = 0
    metadata_json: dict | None = None


class EnumeratorActivityRead(EnumeratorActivityCreate):
    id: UUID
    enumerator_id: UUID | None
    activity_date: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class StudyRoundCreate(BaseModel):
    name: str
    round_type: str
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool = True


class StudyRoundRead(StudyRoundCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
