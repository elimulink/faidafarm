import { Trash2 } from "lucide-react";
import { useState } from "react";
import ResearchSectionCard from "../../components/ResearchSectionCard";
import { deleteDraft, getDrafts } from "../../fieldStorage/fieldLocalDb";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "Not saved";
}

export default function Drafts() {
  const [drafts, setDrafts] = useState(() => getDrafts());

  function refreshDrafts() {
    setDrafts(getDrafts());
  }

  function handleDelete(draftId) {
    deleteDraft(draftId);
    refreshDrafts();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
          Drafts
        </h1>
        <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
          Offline-first drafts saved locally on this browser before final submission.
        </p>
      </div>

      <ResearchSectionCard title="Local Draft Queue">
        {drafts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No local drafts saved yet. Use a form preview and click Save Draft.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Draft ID", "Form", "Household", "Updated", "Completion", "Device", "Action"].map(
                      (heading) => (
                        <th key={heading} className="px-3 py-3 text-left font-semibold text-slate-700 sm:px-4">
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {drafts.map((draft) => (
                    <tr key={draft.draftId}>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{draft.draftId}</td>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{draft.formTitle}</td>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{draft.householdId}</td>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{formatDate(draft.updatedAt)}</td>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{draft.completionPercent}%</td>
                      <td className="px-3 py-3 text-slate-800 sm:px-4">{draft.deviceId}</td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            Resume
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(draft.draftId)}
                            className="inline-flex items-center gap-1 rounded-full border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ResearchSectionCard>
    </div>
  );
}
