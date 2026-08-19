from pydantic import BaseModel


class CountByCounty(BaseModel):
    county: str
    count: int


class AdminOverview(BaseModel):
    households: int
    fmnr_plots: int
    nutrition_records: int
    field_submissions: int
    queued_sync_items: int


class FMNRMapPoint(BaseModel):
    county: str
    plot_count: int
    tree_count: int
    regenerating_stems_count: int


class DietScoreSummary(BaseModel):
    county: str
    records: int
    average_diet_diversity_score: float | None


class CountyComparison(BaseModel):
    county: str
    households: int
    fmnr_plots: int
    nutrition_records: int


class SyncSummary(BaseModel):
    status: str
    count: int


class PlaceholderMetric(BaseModel):
    status: str
    message: str


class DashboardSummary(BaseModel):
    overview: AdminOverview
    sync: list[SyncSummary]
