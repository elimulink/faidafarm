import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import FieldQuestionEditor from "./FieldQuestionEditor";

export default function FieldQuestionCard({
  question,
  index,
  total,
  onChange,
  onDuplicate,
  onDelete,
  onMove,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 border-l-4 border-l-green-600 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {index + 1}
          </span>
          <h3 className="text-sm font-semibold text-slate-900">{question.type}</h3>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(event) => onChange({ ...question, required: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
          />
          Required
        </label>
      </div>

      <FieldQuestionEditor question={question} onChange={onChange} />

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          className="rounded-full border border-slate-200 p-2 text-slate-600 disabled:opacity-40"
          aria-label="Move question up"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          className="rounded-full border border-slate-200 p-2 text-slate-600 disabled:opacity-40"
          aria-label="Move question down"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDuplicate(question)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:px-3"
          aria-label="Duplicate question"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Duplicate</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className="inline-flex items-center gap-2 rounded-full border border-red-100 p-2 text-sm font-medium text-red-700 hover:bg-red-50 sm:px-3"
          aria-label="Delete question"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </article>
  );
}
