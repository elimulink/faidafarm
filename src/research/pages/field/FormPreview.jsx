import { Camera, MapPin, Save, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fieldForms, previewQuestions } from "../../data/mockFieldCollectionData";
import { getFieldFormById } from "../../fieldStorage/fieldLocalDb";
import { queueSubmission, retryQueuedSubmission } from "../../fieldStorage/fieldSyncQueue";
import useFieldDraft from "../../hooks/useFieldDraft";
import useGeoCapture from "../../hooks/useGeoCapture";
import useOfflineStatus from "../../hooks/useOfflineStatus";
import usePhotoCapture from "../../hooks/usePhotoCapture";

const DEVICE_ID = "WEB-FIELD-001";

function questionKey(question) {
  return (
    question.name ||
    question.id ||
    String(question.label || "field")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "")
  );
}

function getInitialData(questions) {
  return questions.reduce((data, question) => {
    const key = questionKey(question);
    data[key] = question.type === "Multiple Choice" ? [] : question.type === "Consent Checkbox" ? false : "";
    return data;
  }, {});
}

function resolveForm(formId) {
  const localForm = getFieldFormById(formId);
  if (localForm) {
    return {
      formId: localForm.formId,
      title: localForm.title,
      questions: localForm.questions || [],
      source: "Local form",
    };
  }

  const mockForm = fieldForms.find((form) => form.id === formId);
  return {
    formId: mockForm?.id || "fmnr-household-preview",
    title: mockForm?.title || "FMNR Household Field Interview",
    questions: previewQuestions,
    source: mockForm ? "Template form" : "Sample form",
  };
}

function FieldLabel({ label, required = false, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label} {required ? <span className="text-red-500">*</span> : null}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function FormPreview() {
  const { formId = "preview" } = useParams();
  const form = useMemo(() => resolveForm(formId), [formId]);
  const initialData = useMemo(() => getInitialData(form.questions), [form.questions]);
  const { isOnline } = useOfflineStatus();
  const { draftData, updateField, saveCurrentDraft } = useFieldDraft({
    formId: form.formId,
    formTitle: form.title,
    deviceId: DEVICE_ID,
    initialData,
  });
  const { gps, isCapturing, error: gpsError, captureGps, clearGps } = useGeoCapture();
  const { photos, addPhoto, removePhoto, clearPhotos } = usePhotoCapture();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateMultiValue(key, option) {
    const current = draftData[key] || [];
    updateField(key, current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  function getHouseholdId() {
    const householdQuestion = form.questions.find((question) =>
      String(question.label || "").toLowerCase().includes("household")
    );
    return draftData[questionKey(householdQuestion || {})] || draftData.householdId || "Not captured";
  }

  function handleSaveDraft() {
    const saved = saveCurrentDraft();
    setMessage(`Draft saved locally as ${saved.draftId}.`);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setMessage("");

    const missingRequired = form.questions.filter((question) => {
      if (!question.required || ["Section Header", "GPS Location", "Photo Upload"].includes(question.type)) {
        return false;
      }
      const value = draftData[questionKey(question)];
      return Array.isArray(value) ? value.length === 0 : !value;
    });

    if (missingRequired.length > 0) {
      setMessage(`Please complete required fields: ${missingRequired.map((question) => question.label).join(", ")}.`);
      setIsSubmitting(false);
      return;
    }

    const queued = queueSubmission({
      submissionId: `SUB-${Date.now()}`,
      formId: form.formId,
      formTitle: form.title,
      householdId: getHouseholdId(),
      data: draftData,
      gps,
      photos,
      deviceId: DEVICE_ID,
      syncStatus: "queued",
      retryCount: 0,
    });

    if (!isOnline) {
      setMessage("Saved to sync queue. It will upload when online.");
      setIsSubmitting(false);
      return;
    }

    const result = await retryQueuedSubmission(queued.submissionId);
    setMessage(
      result?.syncStatus === "synced"
        ? "Submission queued locally and simulated sync completed."
        : "Submission queued locally. Simulated sync failed and can be retried."
    );
    clearPhotos();
    setIsSubmitting(false);
  }

  function renderQuestion(question) {
    const key = questionKey(question);

    if (question.type === "Section Header") {
      return (
        <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{question.label}</h3>
        </div>
      );
    }

    if (question.type === "Single Choice") {
      return (
        <FieldLabel key={key} label={question.label} required={question.required}>
          <div className="flex flex-wrap gap-2">
            {(question.options || []).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateField(key, option)}
                className={`rounded-full border px-3 py-2 text-sm font-medium ${
                  draftData[key] === option
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </FieldLabel>
      );
    }

    if (question.type === "Multiple Choice") {
      return (
        <FieldLabel key={key} label={question.label} required={question.required}>
          <div className="flex flex-wrap gap-2">
            {(question.options || []).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateMultiValue(key, option)}
                className={`rounded-full border px-3 py-2 text-sm font-medium ${
                  draftData[key]?.includes(option)
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </FieldLabel>
      );
    }

    if (question.type === "Consent Checkbox") {
      return (
        <label key={key} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={Boolean(draftData[key])} onChange={(event) => updateField(key, event.target.checked)} className="mt-1" />
          {question.label} {question.required ? <span className="text-red-500">*</span> : null}
        </label>
      );
    }

    if (question.type === "GPS Location") {
      return (
        <div key={key} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">{question.label}</p>
            <button type="button" onClick={captureGps} disabled={isCapturing} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              <MapPin className="h-4 w-4" />
              {isCapturing ? "Capturing" : "Capture GPS"}
            </button>
          </div>
          {gps ? (
            <div className="mt-3 text-sm leading-6 text-slate-600">
              <p>Latitude: {gps.latitude.toFixed(6)}</p>
              <p>Longitude: {gps.longitude.toFixed(6)}</p>
              <p>Accuracy: {Math.round(gps.accuracy)}m</p>
              <button type="button" onClick={clearGps} className="mt-2 text-sm font-semibold text-green-700">Clear GPS</button>
            </div>
          ) : null}
          {gpsError ? <p className="mt-3 text-sm text-red-600">{gpsError}</p> : null}
        </div>
      );
    }

    if (question.type === "Photo Upload") {
      return (
        <div key={key} className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">{question.label}</p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            <Camera className="h-4 w-4" />
            Add photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => addPhoto(event.target.files?.[0])} />
          </label>
          <div className="mt-3 space-y-2">
            {photos.map((photo, index) => (
              <div key={photo.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <span className="truncate text-sm text-slate-700">{photo.name}</span>
                <button type="button" onClick={() => removePhoto(index)} className="text-sm font-semibold text-red-600">Remove</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "Date" || question.type === "Number" || question.type === "Short Text") {
      return (
        <FieldLabel key={key} label={question.label} required={question.required}>
          <input
            type={question.type === "Date" ? "date" : question.type === "Number" ? "number" : "text"}
            value={draftData[key] || ""}
            onChange={(event) => updateField(key, event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </FieldLabel>
      );
    }

    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-2xl">
          Fill Form
        </h1>
        <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">
          {form.source}. Responses save locally first, then enter the sync queue.
        </p>
      </div>

      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
        <div className="border-b border-slate-100 pb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Enumerator Form</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{form.title}</h2>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 w-1/2 rounded-full bg-green-700" />
          </div>
          <p className="mt-2 hidden text-xs text-slate-500 sm:block">Frontend-only: local draft and queue storage.</p>
        </div>

        <div className="mt-5 space-y-4">{form.questions.map((question) => renderQuestion(question))}</div>

        {message ? (
          <p className="mt-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={handleSaveDraft} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
          <p className="hidden w-full text-xs text-slate-500 sm:block">
            localStorage and base64 photos are prototype-only; production will need encrypted offline storage and backend sync.
          </p>
        </div>
      </section>
    </div>
  );
}
