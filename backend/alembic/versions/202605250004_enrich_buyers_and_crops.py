"""enrich buyers and crops

The Find Buyers page ranks buyers on price, distance and reliability, and the
farm pages show a growth stage and progress. None of that was stored, so both
screens could only draw their own sample data. These columns are what those
screens actually read.

All nullable: existing rows keep working and a buyer with no offer recorded
simply does not rank on price.

Revision ID: 202605250004
Revises: 202605250003
Create Date: 2026-08-20 19:10:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "202605250004"
down_revision: str | None = "202605250003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


BUYER_COLUMNS = [
    sa.Column("channel", sa.String(40), nullable=True),
    sa.Column("buyer_type", sa.String(80), nullable=True),
    sa.Column("town", sa.String(120), nullable=True),
    sa.Column("distance_km", sa.Float(), nullable=True),
    sa.Column("offer_per_kg", sa.Numeric(10, 2), nullable=True),
    sa.Column("demand", sa.String(40), nullable=True),
    sa.Column("verification", sa.String(40), server_default="unverified", nullable=False),
    sa.Column("rating", sa.Float(), nullable=True),
    sa.Column("trades", sa.Integer(), server_default="0", nullable=False),
    sa.Column("payment_terms", sa.String(255), nullable=True),
    sa.Column("min_volume_kg", sa.Integer(), nullable=True),
    sa.Column("transport", sa.String(120), nullable=True),
    sa.Column("last_active_at", sa.DateTime(timezone=True), nullable=True),
]

CROP_COLUMNS = [
    sa.Column("planted_at", sa.DateTime(timezone=True), nullable=True),
    sa.Column("stage", sa.String(80), nullable=True),
    sa.Column("progress_percent", sa.Integer(), nullable=True),
    sa.Column("expected_yield", sa.String(80), nullable=True),
    sa.Column("health", sa.String(40), nullable=True),
]


def upgrade() -> None:
    for column in BUYER_COLUMNS:
        op.add_column("buyers", column)
    op.create_index(op.f("ix_buyers_channel"), "buyers", ["channel"])

    for column in CROP_COLUMNS:
        op.add_column("crops", column)


def downgrade() -> None:
    for column in CROP_COLUMNS:
        op.drop_column("crops", column.name)

    op.drop_index(op.f("ix_buyers_channel"), table_name="buyers")
    for column in BUYER_COLUMNS:
        op.drop_column("buyers", column.name)
