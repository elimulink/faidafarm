from app.schemas.predictions import RecommendationRequest, RecommendationResponse


class RecommendationEngine:
    def recommend(self, _: RecommendationRequest) -> RecommendationResponse:
        return RecommendationResponse(
            recommendation="hold",
            confidence="placeholder",
            message="Sell-now recommendations will use market, weather, and farm data in a later phase.",
        )
