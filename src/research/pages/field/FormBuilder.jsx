import { Eye, Send, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldQuestionCard from "../../components/field/FieldQuestionCard";
import FieldQuestionPalette from "../../components/field/FieldQuestionPalette";
import { builderInitialQuestions, questionTypes } from "../../data/mockFieldCollectionData";
import { saveFieldForm } from "../../fieldStorage/fieldLocalDb";

const defaultSettings = {
  title: "Household Questionnaire",
  code: "HH-FMNR-01",
  round: "Baseline Follow-up",
  respondent: "Primary caregiver",
  duration: "35 minutes",
  gps: true,
  offline: true,
  version: "1.0.0",
};

function createQuestion(type) {
  const isChoice = ["Single Choice", "Multiple Choice"].includes(type);
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label: "Untitled question",
    type,
    required: false,
    options: isChoice ? ["Option 1", "Option 2"] : [],
  };
}

export default function FormBuilder() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(builderInitialQuestions);
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [mobilePanel, setMobilePanel] = useState("questions");

  function updateQuestion(questionId, nextQuestion) {
    setQuestions((current) =>
      current.map((question) => (question.id === questionId ? nextQuestion : question))
    );
  }

  function moveQuestion(from, to) {
    setQuestions((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function persistForm(nextStatus = "Draft") {
    const saved = saveFieldForm({
      settings,
      questions,
      status: nextStatus,
      description: `${settings.round} form for ${settings.respondent}`,
      duration: settings.duration,
      assignedRole: "Field officer",
    });
    setSavedMessage(`Saved locally as ${saved.title}.`);
    return saved;
  }

  return (
    <div className="space-y-4 pb-24 lg:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Form Builder</p>
          <h1 className="mt-1 truncate text-2xl font-bold text-slate-950 sm:text-3xl">{settings.title}</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => persistForm("Draft")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:px-4 sm:py-2"
            aria-label="Save draft"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const saved = persistForm("Draft");
              navigate(`/research/field/forms/${saved.formId}`);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:px-4 sm:py-2"
            aria-label="Preview form"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            type="button"
            onClick={() => {
              persistForm("Active");
              navigate("/research/field/forms");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-green-700 px-3 py-2.5 text-sm font-semibold text-white sm:px-4 sm:py-2"
          >
            <Send className="h-4 w-4" />
            <span className="hidden min-[380px]:inline">Publish</span>
          </button>
        </div>
      </div>
      {savedMessage ? (
        <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
          {savedMessage}
        </p>
      ) : null}

      <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm lg:hidden">
        {[
          ["questions", "Questions"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMobilePanel(key)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
              mobilePanel === key ? "bg-green-700 text-white" : "text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        <div className="hidden lg:block">
          <FieldQuestionPalette
            questionTypes={questionTypes}
            onAddQuestion={(type) => setQuestions((current) => [...current, createQuestion(type)])}
          />
        </div>

        <section className={`${mobilePanel === "questions" ? "space-y-4" : "hidden lg:block lg:space-y-4"}`}>
          <div className="rounded-2xl border border-slate-200 border-t-4 border-t-green-700 bg-white p-4 shadow-sm">
            <input
              value={settings.title}
              onChange={(event) => setSettings({ ...settings, title: event.target.value })}
              className="w-full border-0 bg-transparent p-0 text-3xl font-semibold text-slate-950 outline-none placeholder:text-slate-400"
              aria-label="Form title"
            />
            <input
              value={settings.code}
              onChange={(event) => setSettings({ ...settings, code: event.target.value })}
              className="mt-3 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-500 outline-none placeholder:text-slate-400"
              aria-label="Form code"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-slate-700">Questions</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {questions.length}
            </span>
          </div>
          {questions.map((question, index) => (
            <FieldQuestionCard
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
              onChange={(nextQuestion) => updateQuestion(question.id, nextQuestion)}
              onDuplicate={(target) =>
                setQuestions((current) => [
                  ...current.slice(0, index + 1),
                  { ...target, id: `${Date.now()}-${target.id}`, label: `${target.label} copy` },
                  ...current.slice(index + 1),
                ])
              }
              onDelete={(questionId) =>
                setQuestions((current) => current.filter((item) => item.id !== questionId))
              }
              onMove={moveQuestion}
            />
          ))}
        </section>

        <section className={`${mobilePanel === "settings" ? "" : "hidden lg:block"} rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start`}>
          <h2 className="text-sm font-semibold text-slate-950">Settings</h2>
          <div className="mt-4 space-y-3">
            {[
              ["title", "Form title"],
              ["code", "Form code"],
              ["round", "Study round"],
              ["respondent", "Target respondent"],
              ["duration", "Estimated duration"],
              ["version", "Version number"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm font-medium text-slate-700">
                {label}
                <input
                  value={settings[key]}
                  onChange={(event) => setSettings({ ...settings, [key]: event.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </label>
            ))}

            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              Requires GPS?
              <input type="checkbox" checked={settings.gps} onChange={(event) => setSettings({ ...settings, gps: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              Offline enabled?
              <input type="checkbox" checked={settings.offline} onChange={(event) => setSettings({ ...settings, offline: event.target.checked })} />
            </label>
          </div>
        </section>
      </div>

      {mobilePanel === "questions" ? (
        <FieldQuestionPalette
          questionTypes={questionTypes}
          onAddQuestion={(type) => setQuestions((current) => [...current, createQuestion(type)])}
          mobileToolbar
        />
      ) : null}
    </div>
  );
}
