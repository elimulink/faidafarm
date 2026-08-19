import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ResearchSite(Base):
    __tablename__ = "research_sites"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), index=True)
    county: Mapped[str] = mapped_column(String(120), index=True)
    sub_county: Mapped[str | None] = mapped_column(String(120))
    ward: Mapped[str | None] = mapped_column(String(120))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Household(Base):
    __tablename__ = "households"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("research_sites.id", ondelete="SET NULL"), index=True)
    enumerator_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    external_id: Mapped[str | None] = mapped_column(String(160), unique=True, index=True)
    county: Mapped[str] = mapped_column(String(120), index=True)
    sub_county: Mapped[str | None] = mapped_column(String(120))
    ward: Mapped[str | None] = mapped_column(String(120))
    village: Mapped[str | None] = mapped_column(String(160))
    head_name: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(32))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    kobo_submission_id: Mapped[str | None] = mapped_column(String(160), unique=True, index=True)
    source: Mapped[str] = mapped_column(String(80), default="manual")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    members = relationship("HouseholdMember", back_populates="household", cascade="all, delete-orphan")
    nutrition_records = relationship("ChildNutritionRecord", back_populates="household")
    fmnr_plots = relationship("FMNRPlot", back_populates="household")


class HouseholdMember(Base):
    __tablename__ = "household_members"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("households.id", ondelete="CASCADE"), index=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    age_years: Mapped[int | None] = mapped_column(Integer)
    gender: Mapped[str | None] = mapped_column(String(40))
    relationship_to_head: Mapped[str | None] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    household = relationship("Household", back_populates="members")


class ChildNutritionRecord(Base):
    __tablename__ = "child_nutrition_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("households.id", ondelete="CASCADE"), index=True)
    child_name: Mapped[str | None] = mapped_column(String(255))
    child_age_months: Mapped[int | None] = mapped_column(Integer)
    gender: Mapped[str | None] = mapped_column(String(40))
    county: Mapped[str | None] = mapped_column(String(120), index=True)
    diet_diversity_score: Mapped[int | None] = mapped_column(Integer)
    meal_frequency: Mapped[int | None] = mapped_column(Integer)
    notes: Mapped[str | None] = mapped_column(Text)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    household = relationship("Household", back_populates="nutrition_records")


class FMNRPlot(Base):
    __tablename__ = "fmnr_plots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("households.id", ondelete="SET NULL"), index=True)
    site_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("research_sites.id", ondelete="SET NULL"), index=True)
    county: Mapped[str] = mapped_column(String(120), index=True)
    plot_code: Mapped[str | None] = mapped_column(String(160), unique=True, index=True)
    area_acres: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    tree_count: Mapped[int | None] = mapped_column(Integer)
    regenerating_stems_count: Mapped[int | None] = mapped_column(Integer)
    adopted_practices: Mapped[dict | None] = mapped_column(JSONB)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    measured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    household = relationship("Household", back_populates="fmnr_plots")


class EnumeratorActivity(Base):
    __tablename__ = "enumerator_activities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    enumerator_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    county: Mapped[str | None] = mapped_column(String(120), index=True)
    activity_type: Mapped[str] = mapped_column(String(120), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    records_count: Mapped[int] = mapped_column(Integer, default=0)
    activity_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    metadata_json: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class KoboImportLog(Base):
    __tablename__ = "kobo_import_logs"
    __table_args__ = (UniqueConstraint("kobo_submission_id", name="uq_kobo_import_logs_kobo_submission_id"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kobo_submission_id: Mapped[str] = mapped_column(String(160), index=True)
    form_id: Mapped[str | None] = mapped_column(String(160), index=True)
    status: Mapped[str] = mapped_column(String(40), default="imported", index=True)
    error_message: Mapped[str | None] = mapped_column(Text)
    raw_payload: Mapped[dict | None] = mapped_column(JSONB)
    imported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
