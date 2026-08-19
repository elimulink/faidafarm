import ResearchSectionCard from "../components/ResearchSectionCard";
import ResearchTable from "../components/ResearchTable";
import { syncDevices } from "../data/mockResearchData";

const columns = [
  { key: "device", label: "Device" },
  { key: "enumerator", label: "Enumerator" },
  { key: "status", label: "Status" },
  { key: "failed", label: "Failed Submissions" },
  { key: "lastSync", label: "Last Sync" },
];

export default function SyncStatus() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-black leading-tight text-slate-900 sm:text-2xl">
          Sync Status
        </h1>
        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          Device sync and failed submissions.
        </p>
      </div>

      <ResearchSectionCard title="Device Sync" plain>
        <ResearchTable columns={columns} rows={syncDevices} />
      </ResearchSectionCard>
    </div>
  );
}
