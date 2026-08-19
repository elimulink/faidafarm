"""add operational foundations

Revision ID: 202605250003
Revises: 202605250002
Create Date: 2026-05-25 00:20:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "202605250003"
down_revision: str | None = "202605250002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def created_at_column() -> sa.Column:
    return sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False)


def updated_at_column() -> sa.Column:
    return sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False)


def upgrade() -> None:
    op.add_column("field_submissions", sa.Column("review_status", sa.String(40), server_default="pending", nullable=False))
    op.create_index(op.f("ix_field_submissions_review_status"), "field_submissions", ["review_status"])

    op.create_table(
        "study_rounds",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("round_type", sa.String(40), nullable=False),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        created_at_column(),
        updated_at_column(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_study_rounds")),
    )
    op.create_index(op.f("ix_study_rounds_name"), "study_rounds", ["name"])
    op.create_index(op.f("ix_study_rounds_round_type"), "study_rounds", ["round_type"])

    op.create_table(
        "consent_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("household_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("subject_name", sa.String(255), nullable=True),
        sa.Column("consent_type", sa.String(80), nullable=False),
        sa.Column("consent_given", sa.Boolean(), nullable=False),
        sa.Column("consented_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("recorded_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        created_at_column(),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name=op.f("fk_consent_records_household_id_households"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["recorded_by_id"], ["users.id"], name=op.f("fk_consent_records_recorded_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_consent_records")),
    )
    for column in ["household_id", "consent_type", "recorded_by_id"]:
        op.create_index(op.f(f"ix_consent_records_{column}"), "consent_records", [column])

    op.create_table(
        "supervisor_reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_type", sa.String(80), nullable=False),
        sa.Column("target_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("reviewer_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.ForeignKeyConstraint(["reviewer_id"], ["users.id"], name=op.f("fk_supervisor_reviews_reviewer_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_supervisor_reviews")),
    )
    for column in ["target_type", "target_id", "status", "reviewer_id"]:
        op.create_index(op.f(f"ix_supervisor_reviews_{column}"), "supervisor_reviews", [column])

    op.create_table(
        "data_quality_flags",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_type", sa.String(80), nullable=False),
        sa.Column("target_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("severity", sa.String(40), nullable=False),
        sa.Column("code", sa.String(120), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("raised_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        created_at_column(),
        sa.ForeignKeyConstraint(["raised_by_id"], ["users.id"], name=op.f("fk_data_quality_flags_raised_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_data_quality_flags")),
    )
    for column in ["target_type", "target_id", "severity", "code", "status", "raised_by_id"]:
        op.create_index(op.f(f"ix_data_quality_flags_{column}"), "data_quality_flags", [column])

    op.create_table(
        "safeguarding_referrals",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("household_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("referral_type", sa.String(120), nullable=False),
        sa.Column("priority", sa.String(40), nullable=False),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("assigned_to_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name=op.f("fk_safeguarding_referrals_household_id_households"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["assigned_to_id"], ["users.id"], name=op.f("fk_safeguarding_referrals_assigned_to_id_users"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["created_by_id"], ["users.id"], name=op.f("fk_safeguarding_referrals_created_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_safeguarding_referrals")),
    )
    for column in ["household_id", "referral_type", "priority", "status", "assigned_to_id", "created_by_id"]:
        op.create_index(op.f(f"ix_safeguarding_referrals_{column}"), "safeguarding_referrals", [column])

    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("actor_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(160), nullable=False),
        sa.Column("target_type", sa.String(80), nullable=True),
        sa.Column("target_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        created_at_column(),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"], name=op.f("fk_audit_logs_actor_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_audit_logs")),
    )
    for column in ["actor_id", "action", "target_type", "target_id", "created_at"]:
        op.create_index(op.f(f"ix_audit_logs_{column}"), "audit_logs", [column])

    op.create_table(
        "export_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("requested_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("export_type", sa.String(80), nullable=False),
        sa.Column("format", sa.String(20), nullable=False),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("filters", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("file_url", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        created_at_column(),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["requested_by_id"], ["users.id"], name=op.f("fk_export_jobs_requested_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_export_jobs")),
    )
    for column in ["requested_by_id", "export_type", "format", "status", "created_at"]:
        op.create_index(op.f(f"ix_export_jobs_{column}"), "export_jobs", [column])

    op.create_table(
        "system_notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        created_at_column(),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_system_notifications_user_id_users"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_system_notifications")),
    )
    for column in ["user_id", "category", "created_at"]:
        op.create_index(op.f(f"ix_system_notifications_{column}"), "system_notifications", [column])

    op.create_table(
        "media_assets",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("related_type", sa.String(80), nullable=True),
        sa.Column("related_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("media_type", sa.String(80), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=True),
        sa.Column("content_type", sa.String(120), nullable=True),
        sa.Column("storage_url", sa.Text(), nullable=True),
        sa.Column("checksum", sa.String(128), nullable=True),
        sa.Column("size_bytes", sa.Integer(), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        created_at_column(),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], name=op.f("fk_media_assets_owner_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_media_assets")),
    )
    for column in ["owner_id", "related_type", "related_id", "media_type", "checksum", "created_at"]:
        op.create_index(op.f(f"ix_media_assets_{column}"), "media_assets", [column])

    op.create_table(
        "organization_settings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("key", sa.String(160), nullable=False),
        sa.Column("value", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("updated_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.ForeignKeyConstraint(["updated_by_id"], ["users.id"], name=op.f("fk_organization_settings_updated_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_organization_settings")),
    )
    op.create_index(op.f("ix_organization_settings_key"), "organization_settings", ["key"], unique=True)
    op.create_index(op.f("ix_organization_settings_updated_by_id"), "organization_settings", ["updated_by_id"])

    op.create_table(
        "project_settings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("project_code", sa.String(120), nullable=False),
        sa.Column("key", sa.String(160), nullable=False),
        sa.Column("value", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        created_at_column(),
        updated_at_column(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_project_settings")),
    )
    op.create_index(op.f("ix_project_settings_project_code"), "project_settings", ["project_code"])
    op.create_index(op.f("ix_project_settings_key"), "project_settings", ["key"])

    op.create_table(
        "county_configurations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("county", sa.String(120), nullable=False),
        sa.Column("site_code", sa.String(120), nullable=True),
        sa.Column("site_name", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_county_configurations")),
        sa.UniqueConstraint("county", "site_code", name="uq_county_configurations_county_site_code"),
    )
    op.create_index(op.f("ix_county_configurations_county"), "county_configurations", ["county"])
    op.create_index(op.f("ix_county_configurations_site_code"), "county_configurations", ["site_code"])

    op.create_table(
        "feature_flags",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("key", sa.String(160), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_feature_flags")),
    )
    op.create_index(op.f("ix_feature_flags_key"), "feature_flags", ["key"], unique=True)

    op.create_table(
        "kobo_project_configs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("project_id", sa.String(160), nullable=False),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("form_type", sa.String(120), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("last_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        created_at_column(),
        updated_at_column(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_kobo_project_configs")),
    )
    op.create_index(op.f("ix_kobo_project_configs_project_id"), "kobo_project_configs", ["project_id"], unique=True)
    op.create_index(op.f("ix_kobo_project_configs_form_type"), "kobo_project_configs", ["form_type"])


def downgrade() -> None:
    for table in [
        "kobo_project_configs",
        "feature_flags",
        "county_configurations",
        "project_settings",
        "organization_settings",
        "media_assets",
        "system_notifications",
        "export_jobs",
        "audit_logs",
        "safeguarding_referrals",
        "data_quality_flags",
        "supervisor_reviews",
        "consent_records",
        "study_rounds",
    ]:
        op.drop_table(table)
    op.drop_index(op.f("ix_field_submissions_review_status"), table_name="field_submissions")
    op.drop_column("field_submissions", "review_status")
