export default function FieldQuestionEditor({ question, onChange }) {
  const isChoice = ["Single Choice", "Multiple Choice"].includes(question.type);
  const helperText = {
    "GPS Location": "Captures latitude, longitude and accuracy.",
    "Photo Upload": "Use only where consent has been recorded.",
    "Consent Checkbox": "Required before sensitive or child-related modules.",
  }[question.type];

  function updateOption(index, value) {
    const nextOptions = question.options.map((option, optionIndex) =>
      optionIndex === index ? value : option
    );
    onChange({ ...question, options: nextOptions });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Label
        <input
          value={question.label}
          onChange={(event) => onChange({ ...question, label: event.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
        />
      </label>

      {isChoice ? (
        <div>
          <p className="text-sm font-medium text-slate-700">Options</p>
          <div className="mt-2 space-y-2">
            {question.options.map((option, index) => (
              <input
                key={`${question.id}-${index}`}
                value={option}
                onChange={(event) => updateOption(index, event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...question,
                options: [...question.options, `Option ${question.options.length + 1}`],
              })
            }
            className="mt-2 text-sm font-semibold text-green-700 hover:text-green-800"
          >
            + Add option
          </button>
        </div>
      ) : null}

      {helperText ? <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{helperText}</p> : null}
    </div>
  );
}
