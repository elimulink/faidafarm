from app.core.database import normalize_database_url


def test_render_postgres_url_is_normalized_for_psycopg() -> None:
    assert normalize_database_url("postgres://user:pass@host/db").startswith("postgresql+psycopg://")
