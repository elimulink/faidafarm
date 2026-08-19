import ResearchStatCard from "../components/ResearchStatCard";
import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchStatusBadge from "../components/ResearchStatusBadge";
import { countySummaries, fieldActivities, researchStats } from "../data/mockResearchData";

export default function ResearchDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Research Dashboard
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          FMNR, nutrition, and fieldwork progress.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <ResearchStatCard title="Households surveyed" value={researchStats.householdsSurveyed} />
        <ResearchStatCard title="FMNR plots verified" value={researchStats.fmnrPlotsVerified} />
        <ResearchStatCard title="Children assessed" value={researchStats.childrenAssessed} />
        <ResearchStatCard title="Avg diet score" value={researchStats.avgDietScore} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <ResearchSectionCard
          title="County Summary"
          subtitle="FMNR awareness and nutrition tracking by study area"
        >
          <div className="space-y-3">
            {countySummaries.map((item) => (
              <div key={item.county} className="rounded-xl border border-slate-200 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.county}</h3>
                    <p className="text-xs text-slate-500 sm:text-sm">{item.sites}</p>
                  </div>
                  <ResearchStatusBadge status={item.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:mt-4 sm:gap-3 sm:text-sm">
                  <div>
                    <p className="text-slate-500">Households</p>
                    <p className="font-bold">{item.households}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">FMNR aware</p>
                    <p className="font-bold">{item.fmnrAwareness}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Diet score</p>
                    <p className="font-bold">{item.avgDietScore}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResearchSectionCard>

        <ResearchSectionCard title="Field Activity" subtitle="Enumerator progress and review queue">
          <div className="space-y-3">
            {fieldActivities.map((item) => (
              <div
                key={item.enumerator}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3 sm:p-4"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.enumerator}</p>
                  <p className="text-xs text-slate-500 sm:text-sm">{item.county}</p>
                </div>
                <div className="text-right text-xs sm:text-sm">
                  <p className="font-bold text-slate-900">{item.completedForms} forms</p>
                  <p className="text-slate-500">
                    {item.pendingReviews} pending · {item.flagged} flagged
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ResearchSectionCard>
      </div>
    </div>
  );
}
