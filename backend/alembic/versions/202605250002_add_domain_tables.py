"""add domain tables

Revision ID: 202605250002
Revises: 202605250001
Create Date: 2026-05-25 00:10:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "202605250002"
down_revision: str | None = "202605250001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "farms",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("sub_county", sa.String(120), nullable=True),
        sa.Column("ward", sa.String(120), nullable=True),
        sa.Column("size_acres", sa.Numeric(10, 2), nullable=True),
        sa.Column("soil_type", sa.String(120), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], name=op.f("fk_farms_owner_id_users"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_farms")),
    )
    op.create_index(op.f("ix_farms_owner_id"), "farms", ["owner_id"])
    op.create_index(op.f("ix_farms_county"), "farms", ["county"])

    op.create_table(
        "crops",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("variety", sa.String(120), nullable=True),
        sa.Column("season", sa.String(80), nullable=True),
        sa.Column("acreage", sa.Numeric(10, 2), nullable=True),
        sa.Column("expected_harvest_date", sa.DateTime(timezone=True), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], name=op.f("fk_crops_farm_id_farms"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_crops")),
    )
    op.create_index(op.f("ix_crops_farm_id"), "crops", ["farm_id"])
    op.create_index(op.f("ix_crops_name"), "crops", ["name"])

    op.create_table(
        "market_prices",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("crop_name", sa.String(120), nullable=False),
        sa.Column("market_name", sa.String(160), nullable=False),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("unit", sa.String(40), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("source", sa.String(120), nullable=True),
        sa.Column("observed_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_market_prices")),
    )
    op.create_index(op.f("ix_market_prices_crop_name"), "market_prices", ["crop_name"])
    op.create_index(op.f("ix_market_prices_market_name"), "market_prices", ["market_name"])
    op.create_index(op.f("ix_market_prices_county"), "market_prices", ["county"])
    op.create_index(op.f("ix_market_prices_observed_at"), "market_prices", ["observed_at"])

    op.create_table(
        "buyers",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("contact_phone", sa.String(32), nullable=True),
        sa.Column("contact_email", sa.String(320), nullable=True),
        sa.Column("crop_interests", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        *timestamps(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_buyers")),
    )
    op.create_index(op.f("ix_buyers_name"), "buyers", ["name"])
    op.create_index(op.f("ix_buyers_county"), "buyers", ["county"])

    op.create_table(
        "research_sites",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("county", sa.String(120), nullable=False),
        sa.Column("sub_county", sa.String(120), nullable=True),
        sa.Column("ward", sa.String(120), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        *timestamps(),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_research_sites")),
    )
    op.create_index(op.f("ix_research_sites_name"), "research_sites", ["name"])
    op.create_index(op.f("ix_research_sites_county"), "research_sites", ["county"])

    op.create_table(
        "households",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("site_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("enumerator_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("external_id", sa.String(160), nullable=True),
        sa.Column("county", sa.String(120), nullable=False),
        sa.Column("sub_county", sa.String(120), nullable=True),
        sa.Column("ward", sa.String(120), nullable=True),
        sa.Column("village", sa.String(160), nullable=True),
        sa.Column("head_name", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("kobo_submission_id", sa.String(160), nullable=True),
        sa.Column("source", sa.String(80), nullable=False),
        *timestamps(),
        sa.ForeignKeyConstraint(["site_id"], ["research_sites.id"], name=op.f("fk_households_site_id_research_sites"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["enumerator_id"], ["users.id"], name=op.f("fk_households_enumerator_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_households")),
    )
    for column in ["site_id", "enumerator_id", "external_id", "county", "kobo_submission_id"]:
        op.create_index(op.f(f"ix_households_{column}"), "households", [column], unique=column in {"external_id", "kobo_submission_id"})

    op.create_table(
        "household_members",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("household_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("age_years", sa.Integer(), nullable=True),
        sa.Column("gender", sa.String(40), nullable=True),
        sa.Column("relationship_to_head", sa.String(80), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name=op.f("fk_household_members_household_id_households"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_household_members")),
    )
    op.create_index(op.f("ix_household_members_household_id"), "household_members", ["household_id"])

    op.create_table(
        "child_nutrition_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("household_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("child_name", sa.String(255), nullable=True),
        sa.Column("child_age_months", sa.Integer(), nullable=True),
        sa.Column("gender", sa.String(40), nullable=True),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("diet_diversity_score", sa.Integer(), nullable=True),
        sa.Column("meal_frequency", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("recorded_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name=op.f("fk_child_nutrition_records_household_id_households"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_child_nutrition_records")),
    )
    op.create_index(op.f("ix_child_nutrition_records_household_id"), "child_nutrition_records", ["household_id"])
    op.create_index(op.f("ix_child_nutrition_records_county"), "child_nutrition_records", ["county"])
    op.create_index(op.f("ix_child_nutrition_records_recorded_at"), "child_nutrition_records", ["recorded_at"])

    op.create_table(
        "fmnr_plots",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("household_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("site_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("county", sa.String(120), nullable=False),
        sa.Column("plot_code", sa.String(160), nullable=True),
        sa.Column("area_acres", sa.Numeric(10, 2), nullable=True),
        sa.Column("tree_count", sa.Integer(), nullable=True),
        sa.Column("regenerating_stems_count", sa.Integer(), nullable=True),
        sa.Column("adopted_practices", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("measured_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        *timestamps(),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name=op.f("fk_fmnr_plots_household_id_households"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["site_id"], ["research_sites.id"], name=op.f("fk_fmnr_plots_site_id_research_sites"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_fmnr_plots")),
    )
    for column in ["household_id", "site_id", "county", "plot_code", "measured_at"]:
        op.create_index(op.f(f"ix_fmnr_plots_{column}"), "fmnr_plots", [column], unique=column == "plot_code")

    op.create_table(
        "weather_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("temperature_c", sa.Float(), nullable=True),
        sa.Column("rainfall_mm", sa.Float(), nullable=True),
        sa.Column("humidity_percent", sa.Float(), nullable=True),
        sa.Column("wind_speed_kph", sa.Float(), nullable=True),
        sa.Column("summary", sa.String(255), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_weather_snapshots_user_id_users"), ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], name=op.f("fk_weather_snapshots_farm_id_farms"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_weather_snapshots")),
    )
    for column in ["user_id", "farm_id", "county", "captured_at"]:
        op.create_index(op.f(f"ix_weather_snapshots_{column}"), "weather_snapshots", [column])

    op.create_table(
        "farmer_alerts",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("severity", sa.String(40), nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_farmer_alerts_user_id_users"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_farmer_alerts")),
    )
    op.create_index(op.f("ix_farmer_alerts_user_id"), "farmer_alerts", ["user_id"])
    op.create_index(op.f("ix_farmer_alerts_category"), "farmer_alerts", ["category"])

    op.create_table(
        "enumerator_activities",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("enumerator_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("activity_type", sa.String(120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("records_count", sa.Integer(), nullable=False),
        sa.Column("activity_date", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["enumerator_id"], ["users.id"], name=op.f("fk_enumerator_activities_enumerator_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_enumerator_activities")),
    )
    for column in ["enumerator_id", "county", "activity_type", "activity_date"]:
        op.create_index(op.f(f"ix_enumerator_activities_{column}"), "enumerator_activities", [column])

    op.create_table(
        "field_forms",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["created_by_id"], ["users.id"], name=op.f("fk_field_forms_created_by_id_users"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_field_forms")),
    )
    op.create_index(op.f("ix_field_forms_created_by_id"), "field_forms", ["created_by_id"])

    op.create_table(
        "field_questions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("form_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("question_type", sa.String(80), nullable=False),
        sa.Column("required", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("options", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["form_id"], ["field_forms.id"], name=op.f("fk_field_questions_form_id_field_forms"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_field_questions")),
    )
    op.create_index(op.f("ix_field_questions_form_id"), "field_questions", ["form_id"])

    op.create_table(
        "field_submissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("form_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("submitted_by_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("client_submission_id", sa.String(160), nullable=True),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("county", sa.String(120), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("synced_at", sa.DateTime(timezone=True), nullable=True),
        *timestamps(),
        sa.ForeignKeyConstraint(["form_id"], ["field_forms.id"], name=op.f("fk_field_submissions_form_id_field_forms"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["submitted_by_id"], ["users.id"], name=op.f("fk_field_submissions_submitted_by_id_users"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_field_submissions")),
        sa.UniqueConstraint("client_submission_id", name="uq_field_submissions_client_submission_id"),
    )
    for column in ["form_id", "submitted_by_id", "client_submission_id", "status", "county", "submitted_at"]:
        op.create_index(op.f(f"ix_field_submissions_{column}"), "field_submissions", [column])

    op.create_table(
        "submission_answers",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("question_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("answer_value", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["submission_id"], ["field_submissions.id"], name=op.f("fk_submission_answers_submission_id_field_submissions"), ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["question_id"], ["field_questions.id"], name=op.f("fk_submission_answers_question_id_field_questions"), ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_submission_answers")),
    )
    op.create_index(op.f("ix_submission_answers_submission_id"), "submission_answers", ["submission_id"])
    op.create_index(op.f("ix_submission_answers_question_id"), "submission_answers", ["question_id"])

    op.create_table(
        "submission_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("media_type", sa.String(80), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=True),
        sa.Column("storage_url", sa.Text(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["submission_id"], ["field_submissions.id"], name=op.f("fk_submission_media_submission_id_field_submissions"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_submission_media")),
    )
    op.create_index(op.f("ix_submission_media_submission_id"), "submission_media", ["submission_id"])

    op.create_table(
        "device_registrations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("device_uid", sa.String(160), nullable=False),
        sa.Column("device_name", sa.String(255), nullable=True),
        sa.Column("platform", sa.String(80), nullable=True),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_device_registrations_user_id_users"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_device_registrations")),
        sa.UniqueConstraint("device_uid", name="uq_device_registrations_device_uid"),
    )
    op.create_index(op.f("ix_device_registrations_user_id"), "device_registrations", ["user_id"])
    op.create_index(op.f("ix_device_registrations_device_uid"), "device_registrations", ["device_uid"])
    op.create_index(op.f("ix_device_registrations_last_seen_at"), "device_registrations", ["last_seen_at"])

    op.create_table(
        "sync_queue",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("operation", sa.String(80), nullable=False),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("last_error", sa.Text(), nullable=True),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("queued_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_sync_queue_user_id_users"), ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["submission_id"], ["field_submissions.id"], name=op.f("fk_sync_queue_submission_id_field_submissions"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_sync_queue")),
    )
    for column in ["user_id", "submission_id", "status", "queued_at"]:
        op.create_index(op.f(f"ix_sync_queue_{column}"), "sync_queue", [column])

    op.create_table(
        "kobo_import_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("kobo_submission_id", sa.String(160), nullable=False),
        sa.Column("form_id", sa.String(160), nullable=True),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("raw_payload", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("imported_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_kobo_import_logs")),
        sa.UniqueConstraint("kobo_submission_id", name="uq_kobo_import_logs_kobo_submission_id"),
    )
    for column in ["kobo_submission_id", "form_id", "status", "imported_at"]:
        op.create_index(op.f(f"ix_kobo_import_logs_{column}"), "kobo_import_logs", [column])


def downgrade() -> None:
    for table in [
        "kobo_import_logs",
        "sync_queue",
        "device_registrations",
        "submission_media",
        "submission_answers",
        "field_submissions",
        "field_questions",
        "field_forms",
        "enumerator_activities",
        "farmer_alerts",
        "weather_snapshots",
        "fmnr_plots",
        "child_nutrition_records",
        "household_members",
        "households",
        "research_sites",
        "buyers",
        "market_prices",
        "crops",
        "farms",
    ]:
        op.drop_table(table)
