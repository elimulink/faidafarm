from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.role import UserRole
from app.models.user import User
from app.services.firebase_auth import FirebaseAuthService
from app.services.users import get_or_create_user_from_firebase


bearer_scheme = HTTPBearer(auto_error=False)


def get_bearer_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> str:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials


async def get_current_firebase_user(
    token: Annotated[str, Depends(get_bearer_token)],
) -> dict:
    return await FirebaseAuthService.verify_id_token(token)


async def get_current_user(
    decoded_token: Annotated[dict, Depends(get_current_firebase_user)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    try:
        user = get_or_create_user_from_firebase(db, decoded_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )
    return user


def require_roles(*roles: UserRole | str):
    allowed_roles = {UserRole(role) if isinstance(role, str) else role for role in roles}

    async def dependency(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return current_user

    return dependency
