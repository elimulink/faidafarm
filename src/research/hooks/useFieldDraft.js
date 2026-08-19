import { useCallback, useState } from "react";
import { getDraftById, saveDraft } from "../fieldStorage/fieldLocalDb";

export default function useFieldDraft({ formId, formTitle, deviceId, initialData = {} } = {}) {
  const [draftId, setDraftId] = useState(null);
  const [draftData, setDraftData] = useState(initialData);

  function updateField(name, value) {
    setDraftData((current) => ({ ...current, [name]: value }));
  }

  const saveCurrentDraft = useCallback(() => {
    const filledFields = Object.values(draftData).filter((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    ).length;
    const totalFields = Math.max(Object.keys(draftData).length, 1);
    const saved = saveDraft({
      draftId,
      formId,
      formTitle,
      householdId: draftData.householdId || "Not captured",
      data: draftData,
      completionPercent: Math.round((filledFields / totalFields) * 100),
      deviceId,
    });

    setDraftId(saved.draftId);
    return saved;
  }, [deviceId, draftData, draftId, formId, formTitle]);

  function loadDraft(id) {
    const draft = getDraftById(id);
    if (draft) {
      setDraftId(draft.draftId);
      setDraftData(draft.data || {});
    }
    return draft;
  }

  function clearDraft() {
    setDraftId(null);
    setDraftData(initialData);
  }

  return {
    draftData,
    updateField,
    saveCurrentDraft,
    loadDraft,
    clearDraft,
  };
}
