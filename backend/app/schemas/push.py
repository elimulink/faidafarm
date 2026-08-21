from pydantic import BaseModel, Field


class DeviceTokenRegister(BaseModel):
    token: str = Field(..., min_length=1, max_length=512)
    platform: str = Field("android", max_length=16)


class PushAck(BaseModel):
    ok: bool
