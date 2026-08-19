import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchTable from "../components/ResearchTable";
import { households } from "../data/mockResearchData";

const columns = [
  { key: "id", label: "Household" },
  { key: "county", label: "County" },
  { key: "site", label: "Site" },
  { key: "caregiver", label: "Caregiver" },
  { key: "fmnrStatus", label: "FMNR" },
  { key: "childAgeGroup", label: "Child Age" },
  { key: "surveyStatus", label: "Status" },
];

export default function Households() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Households
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          Household registry and follow-up status.
        </p>
      </div>

      <ResearchSectionCard title="Follow-up Records" plain>
        <ResearchTable columns={columns} rows={households} />
      </ResearchSectionCard>
    </div>
  );
}
