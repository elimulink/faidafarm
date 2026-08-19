class WeatherRiskService:
    def assess(self, county: str | None = None) -> dict:
        return {
            "county": county,
            "risk_available": False,
            "message": "Weather risk scoring interface is prepared for future providers.",
        }
