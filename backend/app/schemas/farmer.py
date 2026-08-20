from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class FarmCreate(BaseModel):
    name: str
    county: str | None = None
    sub_county: str | None = None
    ward: str | None = None
    size_acres: Decimal | None = None
    soil_type: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class FarmRead(FarmCreate):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class CropCreate(BaseModel):
    farm_id: UUID
    name: str
    variety: str | None = None
    season: str | None = None
    acreage: Decimal | None = None
    planted_at: datetime | None = None
    expected_harvest_date: datetime | None = None
    stage: str | None = None
    progress_percent: int | None = Field(default=None, ge=0, le=100)
    expected_yield: str | None = None
    health: str | None = None


class CropRead(CropCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class CropUpdate(BaseModel):
    name: str | None = None
    variety: str | None = None
    season: str | None = None
    acreage: Decimal | None = None
    planted_at: datetime | None = None
    expected_harvest_date: datetime | None = None
    stage: str | None = None
    progress_percent: int | None = Field(default=None, ge=0, le=100)
    expected_yield: str | None = None
    health: str | None = None


class MarketPriceRead(BaseModel):
    id: UUID
    crop_name: str
    market_name: str
    county: str | None
    unit: str
    price: Decimal
    source: str | None
    observed_at: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class WeatherSnapshotRead(BaseModel):
    id: UUID
    farm_id: UUID | None
    county: str | None
    temperature_c: float | None
    rainfall_mm: float | None
    humidity_percent: float | None
    wind_speed_kph: float | None
    summary: str | None
    captured_at: datetime
    model_config = ConfigDict(from_attributes=True)


class BuyerRead(BaseModel):
    id: UUID
    name: str
    county: str | None
    contact_phone: str | None
    contact_email: EmailStr | None
    crop_interests: str | None
    channel: str | None
    buyer_type: str | None
    town: str | None
    distance_km: float | None
    offer_per_kg: Decimal | None
    demand: str | None
    verification: str
    rating: float | None
    trades: int
    payment_terms: str | None
    min_volume_kg: int | None
    transport: str | None
    last_active_at: datetime | None
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FarmerAlertRead(BaseModel):
    id: UUID
    title: str
    message: str
    category: str
    severity: str
    read_at: datetime | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FarmerDashboard(BaseModel):
    farms_count: int
    active_alerts_count: int
    recent_market_prices: list[MarketPriceRead]
    recent_alerts: list[FarmerAlertRead]
    weather: list[WeatherSnapshotRead]
