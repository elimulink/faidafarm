import { RotateCw } from "lucide-react";
import ResearchStatusBadge from "../ResearchStatusBadge";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "Not attempted";
}

export default function FieldSyncItem({ item, onRetry, isRetrying = false }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{item.submissionId}</p>
          <p className="mt-1 text-sm text-slate-600">{item.formTitle || item.formName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ResearchStatusBadge status={item.syncStatus} />
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying || item.syncStatus === "synced"}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            <RotateCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Household</dt><dd>{item.householdId || "Not captured"}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Device</dt><dd>{item.deviceId || item.device}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Retries</dt><dd>{item.retryCount}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-slate-400">Last Attempt</dt><dd>{formatDate(item.lastAttempt)}</dd></div>
        <div className="sm:col-span-4"><dt className="text-xs uppercase tracking-wide text-slate-400">Error</dt><dd>{item.errorMessage || item.errorReason || "None"}</dd></div>
      </dl>
    </article>
  );
}
