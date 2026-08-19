from pydantic import BaseModel, Field

from app.schemas.user import UserRead


class FirebaseTokenRequest(BaseModel):
    id_token: str = Field(..., min_length=1)


class AuthStatusResponse(BaseModel):
    detail: str


class AuthVerifyResponse(BaseModel):
    authenticated: bool
    user: UserRead
