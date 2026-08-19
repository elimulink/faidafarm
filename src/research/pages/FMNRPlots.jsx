import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchTable from "../components/ResearchTable";
import { fmnrPlots } from "../data/mockResearchData";

const columns = [
  { key: "plotId", label: "Plot" },
  { key: "county", label: "County" },
  { key: "intensity", label: "Intensity" },
  { key: "gps", label: "GPS" },
  { key: "observation", label: "Observation" },
  { key: "photoEvidence", label: "Photo" },
];

export default function FMNRPlots() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          FMNR Plots
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          Plot observations and verification status.
        </p>
      </div>

      <ResearchSectionCard
        title="Plot Checklist"
        subtitle="Supports pruning, protection, ground cover, and restoration verification"
        plain
      >
        <ResearchTable columns={columns} rows={fmnrPlots} />
      </ResearchSectionCard>
    </div>
  );
}
