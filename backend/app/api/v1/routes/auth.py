from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.firebase_auth import FirebaseAuthService
from app.services.users import get_or_create_user_from_firebase
from app.schemas.auth import AuthVerifyResponse, FirebaseTokenRequest

router = APIRouter()


@router.post("/verify", response_model=AuthVerifyResponse)
async def verify_firebase_token(
    payload: FirebaseTokenRequest,
    db: Annotated[Session, Depends(get_db)],
) -> AuthVerifyResponse:
    decoded_token = await FirebaseAuthService.verify_id_token(payload.id_token)
    user = get_or_create_user_from_firebase(db, decoded_token)
    return AuthVerifyResponse(authenticated=True, user=user)
