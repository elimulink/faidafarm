from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import require_roles
from app.services.weather import fetch_forecast, refresh_for_user
from app.models.farmer import Buyer, Crop, Farm, FarmerAlert, MarketPrice, WeatherSnapshot
from app.models.role import UserRole
from app.models.user import User
from app.schemas.farmer import (
    BuyerRead,
    CropCreate,
    CropRead,
    CropUpdate,
    FarmCreate,
    FarmerAlertRead,
    FarmerDashboard,
    FarmRead,
    MarketPriceRead,
    WeatherSnapshotRead,
)

farmer_access = require_roles(UserRole.FARMER)
router = APIRouter(dependencies=[Depends(farmer_access)])


CurrentFarmer = Annotated[User, Depends(farmer_access)]
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/dashboard", response_model=FarmerDashboard)
def dashboard(current_user: CurrentFarmer, db: DbSession) -> FarmerDashboard:
    farms_count = db.scalar(select(func.count()).select_from(Farm).where(Farm.owner_id == current_user.id)) or 0
    active_alerts_count = db.scalar(
        select(func.count()).select_from(FarmerAlert).where(FarmerAlert.user_id == current_user.id, FarmerAlert.read_at.is_(None))
    ) or 0
    recent_market_prices = list(db.scalars(select(MarketPrice).order_by(MarketPrice.observed_at.desc()).limit(5)))
    recent_alerts = list(
        db.scalars(
            select(FarmerAlert)
            .where(FarmerAlert.user_id == current_user.id)
            .order_by(FarmerAlert.created_at.desc())
            .limit(5)
        )
    )
    weather = list(
        db.scalars(
            select(WeatherSnapshot)
            .where(WeatherSnapshot.user_id == current_user.id)
            .order_by(WeatherSnapshot.captured_at.desc())
            .limit(3)
        )
    )
    return FarmerDashboard(
        farms_count=farms_count,
        active_alerts_count=active_alerts_count,
        recent_market_prices=recent_market_prices,
        recent_alerts=recent_alerts,
        weather=weather,
    )


@router.get("/farms", response_model=list[FarmRead])
def list_farms(current_user: CurrentFarmer, db: DbSession, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[Farm]:
    return list(db.scalars(select(Farm).where(Farm.owner_id == current_user.id).order_by(Farm.created_at.desc()).offset(offset).limit(limit)))


@router.post("/farms", response_model=FarmRead, status_code=status.HTTP_201_CREATED)
def create_farm(payload: FarmCreate, current_user: CurrentFarmer, db: DbSession) -> Farm:
    farm = Farm(owner_id=current_user.id, **payload.model_dump())
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.get("/crops", response_model=list[CropRead])
def list_crops(current_user: CurrentFarmer, db: DbSession, farm_id: UUID | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[Crop]:
    query = select(Crop).join(Farm).where(Farm.owner_id == current_user.id)
    if farm_id:
        query = query.where(Crop.farm_id == farm_id)
    return list(db.scalars(query.order_by(Crop.created_at.desc()).offset(offset).limit(limit)))


@router.post("/crops", response_model=CropRead, status_code=status.HTTP_201_CREATED)
def create_crop(payload: CropCreate, current_user: CurrentFarmer, db: DbSession) -> Crop:
    farm = db.get(Farm, payload.farm_id)
    if farm is None or farm.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found.")
    crop = Crop(**payload.model_dump())
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop


@router.patch("/crops/{crop_id}", response_model=CropRead)
def update_crop(crop_id: UUID, payload: CropUpdate, current_user: CurrentFarmer, db: DbSession) -> Crop:
    crop = db.scalar(select(Crop).join(Farm).where(Crop.id == crop_id, Farm.owner_id == current_user.id))
    if crop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(crop, field, value)
    db.commit()
    db.refresh(crop)
    return crop


@router.get("/market-prices", response_model=list[MarketPriceRead])
def market_prices(
    db: DbSession,
    crop_name: str | None = None,
    county: str | None = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> list[MarketPrice]:
    query = select(MarketPrice)
    if crop_name:
        query = query.where(MarketPrice.crop_name.ilike(f"%{crop_name}%"))
    if county:
        query = query.where(MarketPrice.county == county)
    return list(db.scalars(query.order_by(MarketPrice.observed_at.desc()).offset(offset).limit(limit)))


@router.get("/weather", response_model=list[WeatherSnapshotRead])
async def weather(
    current_user: CurrentFarmer,
    db: DbSession,
    farm_id: UUID | None = None,
    limit: int = Query(20, ge=1, le=100),
    refresh: bool = Query(True, description="Fetch current conditions before returning history."),
) -> list[WeatherSnapshot]:
    # Reading stored rows alone would return nothing for a farmer who has never
    # been fetched for, so the current reading is topped up on the way in. The
    # service no-ops when a recent snapshot already exists.
    if refresh:
        farm = None
        if farm_id:
            farm = db.scalar(select(Farm).where(Farm.id == farm_id, Farm.owner_id == current_user.id))
            if farm is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found.")
        else:
            farm = db.scalars(
                select(Farm).where(Farm.owner_id == current_user.id).order_by(Farm.created_at.asc()).limit(1)
            ).first()
        await refresh_for_user(db, current_user, farm)

    query = select(WeatherSnapshot).where(WeatherSnapshot.user_id == current_user.id)
    if farm_id:
        query = query.where(WeatherSnapshot.farm_id == farm_id)
    return list(db.scalars(query.order_by(WeatherSnapshot.captured_at.desc()).limit(limit)))


@router.get("/weather/forecast")
async def weather_forecast(current_user: CurrentFarmer, db: DbSession, farm_id: UUID | None = None) -> dict:
    """Current conditions, 12 hours and 7 days, for the farm's coordinates."""
    if farm_id:
        farm = db.scalar(select(Farm).where(Farm.id == farm_id, Farm.owner_id == current_user.id))
        if farm is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found.")
    else:
        farm = db.scalars(
            select(Farm).where(Farm.owner_id == current_user.id).order_by(Farm.created_at.asc()).limit(1)
        ).first()

    latitude = farm.latitude if farm and farm.latitude is not None else settings.DEFAULT_LATITUDE
    longitude = farm.longitude if farm and farm.longitude is not None else settings.DEFAULT_LONGITUDE

    try:
        forecast = await fetch_forecast(latitude, longitude)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Weather is unavailable right now.",
        ) from exc

    forecast["place"] = {
        "name": (farm.name if farm else None) or "Your farm",
        "county": (farm.county if farm else None) or "",
    }
    return forecast


@router.get("/buyers", response_model=list[BuyerRead])
def buyers(db: DbSession, county: str | None = None, crop: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[Buyer]:
    query = select(Buyer).where(Buyer.is_active.is_(True))
    if county:
        query = query.where(Buyer.county == county)
    if crop:
        query = query.where(Buyer.crop_interests.ilike(f"%{crop}%"))
    return list(db.scalars(query.order_by(Buyer.name).offset(offset).limit(limit)))


@router.get("/alerts", response_model=list[FarmerAlertRead])
def alerts(current_user: CurrentFarmer, db: DbSession, unread_only: bool = False, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[FarmerAlert]:
    query = select(FarmerAlert).where(FarmerAlert.user_id == current_user.id)
    if unread_only:
        query = query.where(FarmerAlert.read_at.is_(None))
    return list(db.scalars(query.order_by(FarmerAlert.created_at.desc()).offset(offset).limit(limit)))


@router.get("/financing")
def financing_placeholder(_: CurrentFarmer) -> dict[str, str]:
    return {"status": "prepared", "message": "Financing integrations will be added in a later phase."}
