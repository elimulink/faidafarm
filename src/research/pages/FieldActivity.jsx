import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchTable from "../components/ResearchTable";
import { fieldActivities } from "../data/mockResearchData";

const columns = [
  { key: "enumerator", label: "Enumerator" },
  { key: "county", label: "County" },
  { key: "completedForms", label: "Completed Forms" },
  { key: "pendingReviews", label: "Pending Reviews" },
  { key: "flagged", label: "Flagged" },
];

export default function FieldActivity() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Field Activity
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          Enumerator progress and review queue.
        </p>
      </div>

      <ResearchSectionCard title="Enumerator Progress" plain>
        <ResearchTable columns={columns} rows={fieldActivities} />
      </ResearchSectionCard>
    </div>
  );
}
