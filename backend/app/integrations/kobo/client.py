import logging
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings

logger = logging.getLogger(__name__)


class KoboClient:
    def __init__(self) -> None:
        self.base_url = settings.KOBO_BASE_URL.rstrip("/") if settings.KOBO_BASE_URL else None
        self.api_token = settings.KOBO_API_TOKEN
        self.project_id = settings.KOBO_PROJECT_ID

    @property
    def configured(self) -> bool:
        return bool(self.base_url and self.api_token and self.project_id)

    async def fetch_submissions(self) -> list[dict[str, Any]]:
        if not self.configured:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Kobo integration is not configured.",
            )

        url = f"{self.base_url}/api/v2/assets/{self.project_id}/data/"
        headers = {"Authorization": f"Token {self.api_token}"}
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            payload = response.json()

        if isinstance(payload, dict):
            return payload.get("results", [])
        if isinstance(payload, list):
            return payload
        logger.warning("Unexpected Kobo response shape: %s", type(payload))
        return []
