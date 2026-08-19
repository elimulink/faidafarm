import ResearchStatCard from "../../components/ResearchStatCard";
import ResearchSectionCard from "../../components/ResearchSectionCard";
import { researchStats, countySummaries } from "../../data/mockResearchData";

export default function AdminOverview() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-[28px] font-black leading-tight sm:text-2xl">Admin Overview</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <ResearchStatCard title="Households" value={researchStats.householdsSurveyed} />
        <ResearchStatCard title="Children" value={researchStats.childrenAssessed} />
        <ResearchStatCard title="FMNR Plots" value={researchStats.fmnrPlotsVerified} />
        <ResearchStatCard title="Avg Diet Score" value={researchStats.avgDietScore} />
      </div>

      <ResearchSectionCard title="County Performance">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {countySummaries.map((c) => (
            <div key={c.county} className="rounded-xl border p-3 sm:p-4">
              <h3 className="font-bold">{c.county}</h3>
              <p className="text-sm text-slate-500">{c.sites}</p>
              <p className="mt-2 text-sm">FMNR: {c.fmnrAwareness}</p>
              <p className="text-sm">Diet Score: {c.avgDietScore}</p>
            </div>
          ))}
        </div>
      </ResearchSectionCard>
    </div>
  );
}
