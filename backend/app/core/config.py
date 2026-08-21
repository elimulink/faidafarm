from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "FaidaFarm FMNR API"
    API_VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = Field(..., description="PostgreSQL connection string")
    FIREBASE_PROJECT_ID: str | None = None
    # The service account JSON itself, for hosts where a secret file is more
    # trouble than an environment variable. Without it tokens are still
    # verified, just against Google's public certificates.
    FIREBASE_SERVICE_ACCOUNT_JSON: str | None = None
    # The same key split into the two fields that matter, for hosts where
    # setting an environment variable beats uploading a file. Required for
    # anything that acts on Firebase's behalf, such as sending through FCM.
    FIREBASE_CLIENT_EMAIL: str | None = None
    FIREBASE_PRIVATE_KEY: str | None = None
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    # Tried when the primary is rate limited. The lite tier has a far higher
    # free per-minute allowance, which on the free key is the difference
    # between an answer and an error.
    GEMINI_FALLBACK_MODEL: str = "gemini-2.5-flash-lite"
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta"
    ASSISTANT_MAX_OUTPUT_TOKENS: int = 1024

    WEATHER_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    # Nairobi, used when a farm has no coordinates recorded.
    DEFAULT_LATITUDE: float = -1.2921
    DEFAULT_LONGITUDE: float = 36.8219

    KOBO_BASE_URL: str | None = None
    KOBO_API_TOKEN: str | None = None
    KOBO_PROJECT_ID: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def assistant_enabled(self) -> bool:
        return bool(self.GEMINI_API_KEY)

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() in {"local", "dev", "development"}

    @property
    def cors_origins(self) -> list[str]:
        origins = [origin.strip() for origin in self.FRONTEND_URL.split(",")]
        return [origin for origin in origins if origin]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in {"prod", "production"}


settings = Settings()
