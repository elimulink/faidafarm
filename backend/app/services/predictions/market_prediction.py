from app.schemas.predictions import MarketPredictionRequest, MarketPredictionResponse


class MarketPredictionService:
    def forecast(self, request: MarketPredictionRequest) -> MarketPredictionResponse:
        return MarketPredictionResponse(
            crop_name=request.crop_name,
            county=request.county,
            horizon_days=request.horizon_days,
            forecast_available=False,
            message="Market forecasting interface is ready; ML models will be connected later.",
        )
