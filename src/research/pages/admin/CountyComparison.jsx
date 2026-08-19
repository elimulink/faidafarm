import ResearchSectionCard from "../../components/ResearchSectionCard";
import { countySummaries } from "../../data/mockResearchData";

export default function CountyComparison() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-[28px] font-black leading-tight sm:text-2xl">County Comparison</h1>

      <ResearchSectionCard title="Performance Comparison">
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[520px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">County</th>
                <th className="p-2">Households</th>
                <th className="p-2">FMNR %</th>
                <th className="p-2">Diet Score</th>
              </tr>
            </thead>
            <tbody>
              {countySummaries.map((c) => (
                <tr key={c.county} className="border-t">
                  <td className="p-2">{c.county}</td>
                  <td className="p-2 text-center">{c.households}</td>
                  <td className="p-2 text-center">{c.fmnrAwareness}</td>
                  <td className="p-2 text-center">{c.avgDietScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResearchSectionCard>
    </div>
  );
}
