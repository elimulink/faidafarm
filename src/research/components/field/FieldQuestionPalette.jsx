import {
  Calendar,
  Camera,
  CheckSquare,
  Hash,
  ListChecks,
  ListTodo,
  MapPin,
  Pilcrow,
  Type,
} from "lucide-react";

const icons = {
  "Short Text": Type,
  Number: Hash,
  "Single Choice": ListTodo,
  "Multiple Choice": ListChecks,
  Date: Calendar,
  "GPS Location": MapPin,
  "Photo Upload": Camera,
  "Section Header": Pilcrow,
  "Consent Checkbox": CheckSquare,
};

export default function FieldQuestionPalette({ questionTypes, onAddQuestion, mobileToolbar = false }) {
  if (mobileToolbar) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2 overflow-x-auto">
          {questionTypes.map((type) => {
            const Icon = icons[type] || Type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onAddQuestion(type)}
                className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-green-700 shadow-sm"
                aria-label={`Add ${type}`}
                title={type}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-28 lg:self-start">
      <h2 className="px-1 text-sm font-semibold text-slate-950">Add Question</h2>
      <div className="mt-3 space-y-1.5">
        {questionTypes.map((type) => {
          const Icon = icons[type] || Type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onAddQuestion(type)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-green-50 hover:text-green-900"
            >
              <Icon className="h-4 w-4 text-green-700" />
              {type}
            </button>
          );
        })}
      </div>
    </section>
  );
}
