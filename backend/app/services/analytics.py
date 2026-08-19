from sqlalchemy import Float, cast, func, select
from sqlalchemy.orm import Session

from app.models.field import FieldSubmission, SyncQueue
from app.models.research import ChildNutritionRecord, FMNRPlot, Household


class AnalyticsService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def overview(self) -> dict:
        return {
            "households": self.db.scalar(select(func.count()).select_from(Household)) or 0,
            "fmnr_plots": self.db.scalar(select(func.count()).select_from(FMNRPlot)) or 0,
            "nutrition_records": self.db.scalar(select(func.count()).select_from(ChildNutritionRecord)) or 0,
            "field_submissions": self.db.scalar(select(func.count()).select_from(FieldSubmission)) or 0,
            "queued_sync_items": self.db.scalar(select(func.count()).select_from(SyncQueue).where(SyncQueue.status == "queued")) or 0,
        }

    def fmnr_map(self) -> list[dict]:
        rows = self.db.execute(
            select(
                FMNRPlot.county,
                func.count(FMNRPlot.id),
                func.coalesce(func.sum(FMNRPlot.tree_count), 0),
                func.coalesce(func.sum(FMNRPlot.regenerating_stems_count), 0),
            ).group_by(FMNRPlot.county)
        )
        return [
            {
                "county": county,
                "plot_count": plot_count,
                "tree_count": tree_count,
                "regenerating_stems_count": stems,
            }
            for county, plot_count, tree_count, stems in rows
        ]

    def diet_scores(self) -> list[dict]:
        rows = self.db.execute(
            select(
                ChildNutritionRecord.county,
                func.count(ChildNutritionRecord.id),
                func.avg(cast(ChildNutritionRecord.diet_diversity_score, Float)),
            )
            .where(ChildNutritionRecord.county.is_not(None))
            .group_by(ChildNutritionRecord.county)
        )
        return [
            {
                "county": county,
                "records": records,
                "average_diet_diversity_score": float(avg_score) if avg_score is not None else None,
            }
            for county, records, avg_score in rows
        ]

    def county_comparison(self) -> list[dict]:
        counties = {
            county
            for county, in self.db.execute(select(Household.county).distinct())
            if county
        } | {
            county
            for county, in self.db.execute(select(FMNRPlot.county).distinct())
            if county
        }
        return [
            {
                "county": county,
                "households": self.db.scalar(select(func.count()).select_from(Household).where(Household.county == county)) or 0,
                "fmnr_plots": self.db.scalar(select(func.count()).select_from(FMNRPlot).where(FMNRPlot.county == county)) or 0,
                "nutrition_records": self.db.scalar(select(func.count()).select_from(ChildNutritionRecord).where(ChildNutritionRecord.county == county)) or 0,
            }
            for county in sorted(counties)
        ]

    def sync_summary(self) -> list[dict]:
        rows = self.db.execute(select(SyncQueue.status, func.count(SyncQueue.id)).group_by(SyncQueue.status))
        return [{"status": status, "count": count} for status, count in rows]

    def household_resilience(self) -> dict:
        return {
            "status": "prepared",
            "message": "Household resilience scoring will be computed after survey indicators are finalized.",
        }

    def food_security(self) -> dict:
        return {
            "status": "prepared",
            "message": "Food security analytics will be connected to diet and household survey indicators later.",
        }
