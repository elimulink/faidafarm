import { Copy, Eye, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import ResearchStatusBadge from "../ResearchStatusBadge";

export default function FieldFormCard({ form, onDuplicate }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{form.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{form.description}</p>
        </div>
        <ResearchStatusBadge status={form.status} />
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:grid-cols-3">
        <p>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Duration</span>
          {form.duration}
        </p>
        <p>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Assigned</span>
          {form.assignedRole}
        </p>
        <p>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Updated</span>
          {form.updatedAt}
          {form.isLocal ? <span className="ml-2 text-xs font-semibold text-green-700">Local</span> : null}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/research/field/forms/${form.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Link>
        <Link
          to="/research/field/forms/new"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <PenLine className="h-4 w-4" />
          Edit
        </Link>
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
      </div>
    </article>
  );
}
