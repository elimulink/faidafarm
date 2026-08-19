from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.operations import CountyConfiguration, FeatureFlag, OrganizationSetting
from app.models.role import UserRole
from app.models.user import User
from app.schemas.operations import (
    CountyConfigurationCreate,
    CountyConfigurationRead,
    FeatureFlagRead,
    FeatureFlagUpsert,
    SettingRead,
    SettingUpsert,
)

router = APIRouter(dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.SUPERVISOR))])


@router.get("/organization", response_model=list[SettingRead])
def organization_settings(db: Annotated[Session, Depends(get_db)]) -> list[OrganizationSetting]:
    return list(db.scalars(select(OrganizationSetting).order_by(OrganizationSetting.key)))


@router.put("/organization", response_model=SettingRead)
def upsert_organization_setting(
    payload: SettingUpsert,
    current_user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    db: Annotated[Session, Depends(get_db)],
) -> OrganizationSetting:
    setting = db.scalar(select(OrganizationSetting).where(OrganizationSetting.key == payload.key))
    if setting is None:
        setting = OrganizationSetting(key=payload.key, value=payload.value, description=payload.description, updated_by_id=current_user.id)
        db.add(setting)
    else:
        setting.value = payload.value
        setting.description = payload.description
        setting.updated_by_id = current_user.id
    db.commit()
    db.refresh(setting)
    return setting


@router.get("/counties", response_model=list[CountyConfigurationRead])
def county_configurations(db: Annotated[Session, Depends(get_db)], active_only: bool = True, limit: int = Query(100, ge=1, le=200)) -> list[CountyConfiguration]:
    query = select(CountyConfiguration)
    if active_only:
        query = query.where(CountyConfiguration.is_active.is_(True))
    return list(db.scalars(query.order_by(CountyConfiguration.county, CountyConfiguration.site_name).limit(limit)))


@router.post("/counties", response_model=CountyConfigurationRead, status_code=status.HTTP_201_CREATED)
def create_county_configuration(payload: CountyConfigurationCreate, db: Annotated[Session, Depends(get_db)]) -> CountyConfiguration:
    config = CountyConfiguration(**payload.model_dump())
    db.add(config)
    db.commit()
    db.refresh(config)
    return config


@router.get("/feature-flags", response_model=list[FeatureFlagRead])
def feature_flags(db: Annotated[Session, Depends(get_db)]) -> list[FeatureFlag]:
    return list(db.scalars(select(FeatureFlag).order_by(FeatureFlag.key)))


@router.put("/feature-flags", response_model=FeatureFlagRead)
def upsert_feature_flag(payload: FeatureFlagUpsert, db: Annotated[Session, Depends(get_db)]) -> FeatureFlag:
    flag = db.scalar(select(FeatureFlag).where(FeatureFlag.key == payload.key))
    if flag is None:
        flag = FeatureFlag(**payload.model_dump())
        db.add(flag)
    else:
        flag.enabled = payload.enabled
        flag.description = payload.description
    db.commit()
    db.refresh(flag)
    return flag
