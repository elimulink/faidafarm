from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.models.role import UserRole
from app.schemas.predictions import (
    MarketPredictionRequest,
    MarketPredictionResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.predictions.market_prediction import MarketPredictionService
from app.services.predictions.recommendation_engine import RecommendationEngine

router = APIRouter(dependencies=[Depends(require_roles(UserRole.FARMER, UserRole.ANALYST, UserRole.ADMIN))])


@router.post("/market", response_model=MarketPredictionResponse)
def market_prediction(payload: MarketPredictionRequest) -> MarketPredictionResponse:
    return MarketPredictionService().forecast(payload)


@router.post("/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    return RecommendationEngine().recommend(payload)
