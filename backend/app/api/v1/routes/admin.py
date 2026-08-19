from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.role import UserRole
from app.models.operations import ExportJob
from app.models.user import User
from app.schemas.analytics import AdminOverview, CountyComparison, DashboardSummary, DietScoreSummary, FMNRMapPoint, PlaceholderMetric, SyncSummary
from app.schemas.operations import ExportJobCreate, ExportJobRead
from app.services.analytics import AnalyticsService

admin_access = require_roles(UserRole.ADMIN, UserRole.SUPERVISOR)
router = APIRouter(dependencies=[Depends(admin_access)])


@router.get("/overview", response_model=AdminOverview)
def overview(db: Annotated[Session, Depends(get_db)]) -> dict:
    return AnalyticsService(db).overview()


@router.get("/fmnr-map", response_model=list[FMNRMapPoint])
def fmnr_map(db: Annotated[Session, Depends(get_db)]) -> list[dict]:
    return AnalyticsService(db).fmnr_map()


@router.get("/diet-scores", response_model=list[DietScoreSummary])
def diet_scores(db: Annotated[Session, Depends(get_db)]) -> list[dict]:
    return AnalyticsService(db).diet_scores()


@router.get("/county-comparison", response_model=list[CountyComparison])
def county_comparison(db: Annotated[Session, Depends(get_db)]) -> list[dict]:
    return AnalyticsService(db).county_comparison()


@router.get("/sync-summary", response_model=list[SyncSummary])
def sync_summary(db: Annotated[Session, Depends(get_db)]) -> list[dict]:
    return AnalyticsService(db).sync_summary()


@router.get("/dashboard-summary", response_model=DashboardSummary)
def dashboard_summary(db: Annotated[Session, Depends(get_db)]) -> dict:
    service = AnalyticsService(db)
    return {"overview": service.overview(), "sync": service.sync_summary()}


@router.get("/household-resilience", response_model=PlaceholderMetric)
def household_resilience(db: Annotated[Session, Depends(get_db)]) -> dict:
    return AnalyticsService(db).household_resilience()


@router.get("/food-security", response_model=PlaceholderMetric)
def food_security(db: Annotated[Session, Depends(get_db)]) -> dict:
    return AnalyticsService(db).food_security()


@router.get("/exports", response_model=list[ExportJobRead])
def list_exports(db: Annotated[Session, Depends(get_db)], limit: int = Query(50, ge=1, le=100)) -> list[ExportJob]:
    return list(db.scalars(select(ExportJob).order_by(ExportJob.created_at.desc()).limit(limit)))


@router.post("/exports", response_model=ExportJobRead, status_code=status.HTTP_201_CREATED)
def create_export(
    payload: ExportJobCreate,
    current_user: Annotated[User, Depends(admin_access)],
    db: Annotated[Session, Depends(get_db)],
) -> ExportJob:
    export = ExportJob(
        requested_by_id=current_user.id,
        export_type=payload.export_type,
        format=payload.format,
        filters=payload.filters,
        status="prepared",
        completed_at=datetime.now(timezone.utc),
    )
    db.add(export)
    db.commit()
    db.refresh(export)
    return export


@router.get("/exports/{export_format}/{export_type}")
def export_placeholder(export_format: str, export_type: str) -> dict[str, Any]:
    return {
        "status": "prepared",
        "format": export_format,
        "export_type": export_type,
        "message": "Streaming CSV/JSON export generation will be connected in the report worker phase.",
    }
