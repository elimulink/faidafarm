from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.operations import MediaAsset
from app.models.user import User
from app.schemas.operations import MediaAssetCreate, MediaAssetRead

router = APIRouter()


@router.get("/", response_model=list[MediaAssetRead])
def list_media(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    related_type: str | None = None,
    limit: int = Query(50, ge=1, le=100),
) -> list[MediaAsset]:
    query = select(MediaAsset).where(MediaAsset.owner_id == current_user.id)
    if related_type:
        query = query.where(MediaAsset.related_type == related_type)
    return list(db.scalars(query.order_by(MediaAsset.created_at.desc()).limit(limit)))


@router.post("/", response_model=MediaAssetRead, status_code=status.HTTP_201_CREATED)
def register_media_metadata(
    payload: MediaAssetCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> MediaAsset:
    media = MediaAsset(owner_id=current_user.id, **payload.model_dump())
    db.add(media)
    db.commit()
    db.refresh(media)
    return media
