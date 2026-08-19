from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.role import UserRole


class UserBase(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    full_name: str | None = None
    role: UserRole = UserRole.FARMER
    is_active: bool = True


class UserCreate(UserBase):
    firebase_uid: str


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    full_name: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserProfileUpdate(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    full_name: str | None = None


class UserRead(UserBase):
    id: UUID
    firebase_uid: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
