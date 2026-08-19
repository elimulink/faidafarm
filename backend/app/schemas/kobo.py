from datetime import datetime

from pydantic import BaseModel


class KoboSyncResponse(BaseModel):
    imported: int
    skipped: int
    failed: int


class KoboStatusResponse(BaseModel):
    configured: bool
    last_imported_at: datetime | None
    imported_count: int
    failed_count: int
