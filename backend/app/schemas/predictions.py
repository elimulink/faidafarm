from pydantic import BaseModel


class MarketPredictionRequest(BaseModel):
    crop_name: str
    county: str | None = None
    horizon_days: int = 30


class MarketPredictionResponse(BaseModel):
    crop_name: str
    county: str | None
    horizon_days: int
    forecast_available: bool
    message: str


class RecommendationRequest(BaseModel):
    crop_name: str
    county: str | None = None
    quantity: float | None = None


class RecommendationResponse(BaseModel):
    recommendation: str
    confidence: str
    message: str
