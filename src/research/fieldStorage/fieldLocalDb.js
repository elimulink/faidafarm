const DRAFTS_KEY = "faidafarm_field_drafts";
const SUBMISSIONS_KEY = "faidafarm_field_submissions";
const FORMS_KEY = "faidafarm_field_forms";

function readCollection(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeCollection(key, records) {
  if (typeof window === "undefined") {
    return;
  }

  // Temporary prototype storage. Real production sync must move sensitive
  // household and child data out of localStorage.
  window.localStorage.setItem(key, JSON.stringify(records));
}

export function saveDraft(draft) {
  const drafts = readCollection(DRAFTS_KEY);
  const now = new Date().toISOString();
  const nextDraft = {
    ...draft,
    draftId: draft.draftId || `DR-${Date.now()}`,
    createdAt: draft.createdAt || now,
    updatedAt: now,
    syncStatus: "draft",
  };
  const nextDrafts = [
    nextDraft,
    ...drafts.filter((item) => item.draftId !== nextDraft.draftId),
  ];

  writeCollection(DRAFTS_KEY, nextDrafts);
  return nextDraft;
}

export function getDrafts() {
  return readCollection(DRAFTS_KEY);
}

export function getDraftById(id) {
  return getDrafts().find((draft) => draft.draftId === id) || null;
}

export function deleteDraft(id) {
  const nextDrafts = getDrafts().filter((draft) => draft.draftId !== id);
  writeCollection(DRAFTS_KEY, nextDrafts);
}

export function saveSubmission(submission) {
  const submissions = readCollection(SUBMISSIONS_KEY);
  const now = new Date().toISOString();
  const nextSubmission = {
    ...submission,
    submissionId: submission.submissionId || `SUB-${Date.now()}`,
    createdAt: submission.createdAt || now,
    updatedAt: now,
    retryCount: submission.retryCount || 0,
    syncStatus: submission.syncStatus || "queued",
  };
  const nextSubmissions = [
    nextSubmission,
    ...submissions.filter((item) => item.submissionId !== nextSubmission.submissionId),
  ];

  writeCollection(SUBMISSIONS_KEY, nextSubmissions);
  return nextSubmission;
}

export function getSubmissions() {
  return readCollection(SUBMISSIONS_KEY);
}

export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  const nextSubmissions = submissions.map((submission) =>
    submission.submissionId === id
      ? { ...submission, ...updates, updatedAt: new Date().toISOString() }
      : submission
  );
  const updated = nextSubmissions.find((submission) => submission.submissionId === id) || null;

  writeCollection(SUBMISSIONS_KEY, nextSubmissions);
  return updated;
}

export function saveFieldForm(form) {
  const forms = readCollection(FORMS_KEY);
  const now = new Date().toISOString();
  const formId =
    form.formId ||
    `${String(form.settings?.code || form.title || "field-form")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now()}`;
  const nextForm = {
    ...form,
    formId,
    id: formId,
    title: form.settings?.title || form.title || "Untitled field form",
    status: form.status || "Draft",
    createdAt: form.createdAt || now,
    updatedAt: now,
  };
  const nextForms = [nextForm, ...forms.filter((item) => item.formId !== nextForm.formId)];

  writeCollection(FORMS_KEY, nextForms);
  return nextForm;
}

export function getFieldForms() {
  return readCollection(FORMS_KEY);
}

export function getFieldFormById(id) {
  return getFieldForms().find((form) => form.formId === id || form.id === id) || null;
}

export function deleteFieldForm(id) {
  const nextForms = getFieldForms().filter((form) => form.formId !== id && form.id !== id);
  writeCollection(FORMS_KEY, nextForms);
}

export { DRAFTS_KEY, FORMS_KEY, SUBMISSIONS_KEY };
