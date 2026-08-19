import logging

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.integrations.kobo.client import KoboClient
from app.integrations.kobo.parsers import get_submission_id, parse_household
from app.models.research import Household, KoboImportLog

logger = logging.getLogger(__name__)


class KoboSyncService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.client = KoboClient()

    async def sync(self) -> dict[str, int]:
        imported = 0
        skipped = 0
        failed = 0

        submissions = await self.client.fetch_submissions()
        for payload in submissions:
            submission_id = get_submission_id(payload)
            if not submission_id:
                failed += 1
                continue

            exists = self.db.scalar(select(KoboImportLog).where(KoboImportLog.kobo_submission_id == submission_id))
            if exists:
                skipped += 1
                continue

            try:
                household_data = parse_household(payload)
                household = Household(kobo_submission_id=submission_id, **household_data)
                self.db.add(household)
                self.db.add(
                    KoboImportLog(
                        kobo_submission_id=submission_id,
                        form_id=self.client.project_id,
                        status="imported",
                        raw_payload=payload,
                    )
                )
                self.db.commit()
                imported += 1
            except Exception as exc:
                self.db.rollback()
                logger.exception("Failed to import Kobo submission %s", submission_id, exc_info=exc)
                self.db.add(
                    KoboImportLog(
                        kobo_submission_id=submission_id,
                        form_id=self.client.project_id,
                        status="failed",
                        error_message=str(exc),
                        raw_payload=payload,
                    )
                )
                self.db.commit()
                failed += 1

        return {"imported": imported, "skipped": skipped, "failed": failed}

    def status(self) -> dict:
        return {
            "configured": self.client.configured,
            "last_imported_at": self.db.scalar(select(func.max(KoboImportLog.imported_at))),
            "imported_count": self.db.scalar(select(func.count()).select_from(KoboImportLog).where(KoboImportLog.status == "imported")) or 0,
            "failed_count": self.db.scalar(select(func.count()).select_from(KoboImportLog).where(KoboImportLog.status == "failed")) or 0,
        }
