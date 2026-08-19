from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.operations import ConsentRecord, StudyRound
from app.models.research import ChildNutritionRecord, EnumeratorActivity, FMNRPlot, Household, HouseholdMember, ResearchSite
from app.models.role import UserRole
from app.models.user import User
from app.schemas.research import (
    ChildNutritionCreate,
    ChildNutritionRead,
    HouseholdMemberCreate,
    HouseholdMemberRead,
    EnumeratorActivityCreate,
    EnumeratorActivityRead,
    FMNRPlotCreate,
    FMNRPlotRead,
    HouseholdCreate,
    HouseholdRead,
    ResearchSiteCreate,
    ResearchSiteRead,
    StudyRoundCreate,
    StudyRoundRead,
)
from app.schemas.operations import ConsentRecordCreate, ConsentRecordRead

research_access = require_roles(UserRole.RESEARCHER, UserRole.SUPERVISOR, UserRole.ADMIN)
router = APIRouter(dependencies=[Depends(research_access)])
CurrentResearchUser = Annotated[User, Depends(research_access)]
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/sites", response_model=list[ResearchSiteRead])
def list_sites(db: DbSession, county: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[ResearchSite]:
    query = select(ResearchSite)
    if county:
        query = query.where(ResearchSite.county == county)
    return list(db.scalars(query.order_by(ResearchSite.name).offset(offset).limit(limit)))


@router.post("/sites", response_model=ResearchSiteRead, status_code=status.HTTP_201_CREATED)
def create_site(payload: ResearchSiteCreate, db: DbSession) -> ResearchSite:
    site = ResearchSite(**payload.model_dump())
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.get("/households", response_model=list[HouseholdRead])
def list_households(db: DbSession, county: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[Household]:
    query = select(Household)
    if county:
        query = query.where(Household.county == county)
    return list(db.scalars(query.order_by(Household.created_at.desc()).offset(offset).limit(limit)))


@router.post("/households", response_model=HouseholdRead, status_code=status.HTTP_201_CREATED)
def create_household(payload: HouseholdCreate, current_user: CurrentResearchUser, db: DbSession) -> Household:
    household = Household(enumerator_id=current_user.id, **payload.model_dump())
    db.add(household)
    db.commit()
    db.refresh(household)
    return household


@router.get("/household-members", response_model=list[HouseholdMemberRead])
def list_household_members(db: DbSession, household_id: UUID | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[HouseholdMember]:
    query = select(HouseholdMember)
    if household_id:
        query = query.where(HouseholdMember.household_id == household_id)
    return list(db.scalars(query.order_by(HouseholdMember.created_at.desc()).offset(offset).limit(limit)))


@router.post("/household-members", response_model=HouseholdMemberRead, status_code=status.HTTP_201_CREATED)
def create_household_member(payload: HouseholdMemberCreate, db: DbSession) -> HouseholdMember:
    member = HouseholdMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("/fmnr-plots", response_model=list[FMNRPlotRead])
def list_fmnr_plots(db: DbSession, county: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[FMNRPlot]:
    query = select(FMNRPlot)
    if county:
        query = query.where(FMNRPlot.county == county)
    return list(db.scalars(query.order_by(FMNRPlot.measured_at.desc()).offset(offset).limit(limit)))


@router.post("/fmnr-plots", response_model=FMNRPlotRead, status_code=status.HTTP_201_CREATED)
def create_fmnr_plot(payload: FMNRPlotCreate, db: DbSession) -> FMNRPlot:
    plot = FMNRPlot(**payload.model_dump())
    db.add(plot)
    db.commit()
    db.refresh(plot)
    return plot


@router.get("/child-nutrition", response_model=list[ChildNutritionRead])
def list_child_nutrition(db: DbSession, county: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[ChildNutritionRecord]:
    query = select(ChildNutritionRecord)
    if county:
        query = query.where(ChildNutritionRecord.county == county)
    return list(db.scalars(query.order_by(ChildNutritionRecord.recorded_at.desc()).offset(offset).limit(limit)))


@router.post("/child-nutrition", response_model=ChildNutritionRead, status_code=status.HTTP_201_CREATED)
def create_child_nutrition(payload: ChildNutritionCreate, db: DbSession) -> ChildNutritionRecord:
    record = ChildNutritionRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/field-activity", response_model=list[EnumeratorActivityRead])
def list_field_activity(db: DbSession, county: str | None = None, limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[EnumeratorActivity]:
    query = select(EnumeratorActivity)
    if county:
        query = query.where(EnumeratorActivity.county == county)
    return list(db.scalars(query.order_by(EnumeratorActivity.activity_date.desc()).offset(offset).limit(limit)))


@router.post("/field-activity", response_model=EnumeratorActivityRead, status_code=status.HTTP_201_CREATED)
def create_field_activity(payload: EnumeratorActivityCreate, current_user: CurrentResearchUser, db: DbSession) -> EnumeratorActivity:
    activity = EnumeratorActivity(enumerator_id=current_user.id, **payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@router.get("/study-rounds", response_model=list[StudyRoundRead])
def list_study_rounds(db: DbSession, active_only: bool = False) -> list[StudyRound]:
    query = select(StudyRound)
    if active_only:
        query = query.where(StudyRound.is_active.is_(True))
    return list(db.scalars(query.order_by(StudyRound.starts_at.desc().nullslast())))


@router.post("/study-rounds", response_model=StudyRoundRead, status_code=status.HTTP_201_CREATED)
def create_study_round(payload: StudyRoundCreate, db: DbSession) -> StudyRound:
    study_round = StudyRound(**payload.model_dump())
    db.add(study_round)
    db.commit()
    db.refresh(study_round)
    return study_round


@router.get("/consents", response_model=list[ConsentRecordRead])
def list_consents(db: DbSession, household_id: UUID | None = None, limit: int = Query(50, ge=1, le=100)) -> list[ConsentRecord]:
    query = select(ConsentRecord)
    if household_id:
        query = query.where(ConsentRecord.household_id == household_id)
    return list(db.scalars(query.order_by(ConsentRecord.created_at.desc()).limit(limit)))


@router.post("/consents", response_model=ConsentRecordRead, status_code=status.HTTP_201_CREATED)
def create_consent(payload: ConsentRecordCreate, current_user: CurrentResearchUser, db: DbSession) -> ConsentRecord:
    consent = ConsentRecord(recorded_by_id=current_user.id, **payload.model_dump())
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent
