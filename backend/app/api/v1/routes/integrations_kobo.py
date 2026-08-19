from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.integrations.kobo.sync_service import KoboSyncService
from app.models.operations import KoboProjectConfig
from app.models.role import UserRole
from app.schemas.kobo import KoboStatusResponse, KoboSyncResponse
from app.schemas.operations import KoboProjectConfigCreate, KoboProjectConfigRead

router = APIRouter(dependencies=[Depends(require_roles(UserRole.ADMIN))])


@router.post("/sync", response_model=KoboSyncResponse)
async def sync_kobo(db: Annotated[Session, Depends(get_db)]) -> dict[str, int]:
    return await KoboSyncService(db).sync()


@router.get("/status", response_model=KoboStatusResponse)
def kobo_status(db: Annotated[Session, Depends(get_db)]) -> dict:
    return KoboSyncService(db).status()


@router.get("/projects", response_model=list[KoboProjectConfigRead])
def list_kobo_projects(db: Annotated[Session, Depends(get_db)], active_only: bool = True, limit: int = Query(50, ge=1, le=100)) -> list[KoboProjectConfig]:
    query = select(KoboProjectConfig)
    if active_only:
        query = query.where(KoboProjectConfig.is_active.is_(True))
    return list(db.scalars(query.order_by(KoboProjectConfig.created_at.desc()).limit(limit)))


@router.post("/projects", response_model=KoboProjectConfigRead, status_code=status.HTTP_201_CREATED)
def create_kobo_project(payload: KoboProjectConfigCreate, db: Annotated[Session, Depends(get_db)]) -> KoboProjectConfig:
    project = KoboProjectConfig(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
