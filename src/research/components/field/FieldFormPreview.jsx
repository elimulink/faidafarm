import { Camera, CheckSquare, MapPin } from "lucide-react";

function PreviewField({ question }) {
  const required = question.required ? <span className="text-red-500">*</span> : null;

  if (question.type === "Single Choice" || question.type === "Multiple Choice") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">
          {question.label} {required}
        </p>
        <div className="mt-3 space-y-2">
          {(question.options || []).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
              <input type={question.type === "Single Choice" ? "radio" : "checkbox"} disabled />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "GPS Location") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">
          {question.label} {required}
        </p>
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          <MapPin className="h-4 w-4" />
          Capture GPS
        </button>
      </div>
    );
  }

  if (question.type === "Photo Upload") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">
          {question.label} {required}
        </p>
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          <Camera className="h-4 w-4" />
          Add photo
        </button>
      </div>
    );
  }

  if (question.type === "Consent Checkbox") {
    return (
      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800">
        <CheckSquare className="mt-0.5 h-4 w-4 text-green-700" />
        <span>
          {question.label} {required}
        </span>
      </label>
    );
  }

  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800">
      {question.label} {required}
      <input
        type={question.type === "Number" ? "number" : question.type === "Date" ? "date" : "text"}
        disabled
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
      />
    </label>
  );
}

export default function FieldFormPreview({ title, questions }) {
  return (
    <section className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Enumerator Preview</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{title}</h2>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div className="h-2 w-1/3 rounded-full bg-green-700" />
        </div>
        <p className="mt-2 text-xs text-slate-500">Progress 3 of {questions.length} fields</p>
      </div>

      <div className="mt-4 space-y-3">
        {questions.map((question) => (
          <PreviewField key={question.id} question={question} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Save Draft
        </button>
        <button type="button" disabled className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
          Submit
        </button>
        <p className="w-full text-sm text-slate-500">Backend not connected yet.</p>
      </div>
    </section>
  );
}
