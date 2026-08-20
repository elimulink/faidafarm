"""Reconcile alembic_version with what the database actually contains, then migrate.

This database was built without Alembic ever recording it: the tables and the
user_role enum exist, but alembic_version is empty. So `alembic upgrade head`
starts at the first revision and dies on `type "user_role" already exists`,
which blocked every deploy.

Stamping by hand fixes it once. This does it in a way that stays fixed: probe
for an object each revision creates, stamp the highest revision fully present,
then upgrade. On a database Alembic already tracks it does nothing but upgrade,
and on an empty one it migrates from scratch - so it is safe to leave in the
start command permanently.
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect

from app.core.database import engine

logging.basicConfig(level=logging.INFO, format="%(levelname)s [bootstrap] %(message)s")
logger = logging.getLogger(__name__)

# One object per revision that exists only once that revision has run, newest
# first. A table alone is enough except where a revision only adds columns.
REVISION_MARKERS: list[tuple[str, str, str | None]] = [
    ("202605250004", "buyers", "channel"),
    ("202605250003", "audit_logs", None),
    ("202605250002", "buyers", None),
    ("202605250001", "users", None),
]


def detect_revision(inspector) -> str | None:
    """The newest revision whose marker is already present, or None if empty."""
    tables = set(inspector.get_table_names())

    for revision, table, column in REVISION_MARKERS:
        if table not in tables:
            continue
        if column is None:
            return revision
        columns = {c["name"] for c in inspector.get_columns(table)}
        if column in columns:
            return revision

    return None


def main() -> int:
    config = Config(str(Path(__file__).resolve().parent.parent / "alembic.ini"))

    with engine.connect() as connection:
        inspector = inspect(connection)
        tables = set(inspector.get_table_names())

        tracked = False
        if "alembic_version" in tables:
            row = connection.exec_driver_sql("SELECT version_num FROM alembic_version").fetchone()
            tracked = row is not None
            if tracked:
                logger.info("Alembic already tracks this database at %s", row[0])

        if not tracked:
            detected = detect_revision(inspector)
            if detected is None:
                logger.info("Empty database - migrating from scratch")
            else:
                logger.warning(
                    "Schema exists but is untracked; stamping %s and continuing", detected
                )
                command.stamp(config, detected)

    command.upgrade(config, "head")
    logger.info("Migrations are up to date")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        logger.exception("Bootstrap failed; refusing to start on an unknown schema")
        sys.exit(1)
