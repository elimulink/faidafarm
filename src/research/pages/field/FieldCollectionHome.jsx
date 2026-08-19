import ResearchSectionCard from "../../components/ResearchSectionCard";
import ResearchStatCard from "../../components/ResearchStatCard";
import { fieldForms, fieldWorkflowSteps } from "../../data/mockFieldCollectionData";
import { getDrafts, getSubmissions } from "../../fieldStorage/fieldLocalDb";
import useOfflineStatus from "../../hooks/useOfflineStatus";

function getLocalCounts() {
  const drafts = getDrafts();
  const submissions = getSubmissions();
  return {
    drafts: drafts.length,
    queued: submissions.filter((item) => item.syncStatus === "queued").length,
    failed: submissions.filter((item) => item.syncStatus === "failed").length,
    synced: submissions.filter((item) => item.syncStatus === "synced").length,
  };
}

export default function FieldCollectionHome() {
  const { isOnline, statusLabel } = useOfflineStatus();
  const counts = getLocalCounts();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
            Field Collection
          </h1>
          <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">
            Manage digital field forms, drafts, submissions, devices, and sync readiness for FMNR
            research fieldwork.
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
            isOnline
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <ResearchStatCard title="Active Forms" value={fieldForms.filter((form) => form.status === "Active").length} note="Ready for field use" />
        <ResearchStatCard title="Draft Submissions" value={counts.drafts} note="Saved locally" />
        <ResearchStatCard title="Queued Records" value={counts.queued} note="Waiting for sync" />
        <ResearchStatCard title="Sync Issues" value={counts.failed} note={`${counts.synced} synced locally`} />
      </div>

      <ResearchSectionCard title="Field Workflow">
        <ol className="grid gap-2 sm:gap-3 md:grid-cols-5">
          {fieldWorkflowSteps.map((step, index) => (
            <li key={step} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-6 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </ResearchSectionCard>

      <p className="hidden text-xs leading-5 text-slate-500 sm:block">
        Prototype note: localStorage is temporary and not production-secure for sensitive household or child data.
      </p>
    </div>
  );
}
