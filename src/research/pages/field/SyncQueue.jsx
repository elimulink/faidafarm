import FieldSyncItem from "../../components/field/FieldSyncItem";
import ResearchStatCard from "../../components/ResearchStatCard";
import useFieldSyncQueue from "../../hooks/useFieldSyncQueue";
import useOfflineStatus from "../../hooks/useOfflineStatus";

export default function SyncQueue() {
  const { isOnline, statusLabel } = useOfflineStatus();
  const {
    queue,
    retrySubmission,
    retryAll,
    isRetrying,
    queuedCount,
    failedCount,
    syncedCount,
  } = useFieldSyncQueue();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
            Sync Queue
          </h1>
          <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
            Local submissions waiting for backend sync. Sync is simulated for frontend testing.
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

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <ResearchStatCard title="Queued" value={queuedCount} note="Waiting or retrying" />
        <ResearchStatCard title="Failed" value={failedCount} note="Needs retry" />
        <ResearchStatCard title="Synced" value={syncedCount} note="Simulated success" />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={retryAll}
          disabled={isRetrying || queue.length === 0}
          className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Retry All
        </button>
      </div>

      <div className="space-y-3">
        {queue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No local submissions queued yet.
          </div>
        ) : (
          queue.map((item) => (
            <FieldSyncItem
              key={item.submissionId}
              item={item}
              onRetry={() => retrySubmission(item.submissionId)}
              isRetrying={isRetrying}
            />
          ))
        )}
      </div>
    </div>
  );
}
