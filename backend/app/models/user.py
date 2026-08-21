import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.role import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    firebase_uid: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(320), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        Enum(
            UserRole,
            name="user_role",
            # The database type holds the lowercase values - "farmer" - but
            # SQLAlchemy persists an Enum by its NAME, "FARMER", unless told
            # otherwise. Postgres rejects that outright, so every attempt to
            # create a user died on:
            #   invalid input value for enum user_role: "FARMER"
            values_callable=lambda enum: [member.value for member in enum],
        ),
        default=UserRole.FARMER,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    farms = relationship("Farm", back_populates="owner")
    alerts = relationship("FarmerAlert", back_populates="user")
