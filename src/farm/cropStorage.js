// The crops this farmer actually grows.
//
// Chosen during onboarding (where at least one is required) and managed after
// that from My Farm. Persisted locally for now; when the backend lands this
// becomes GET/PUT /api/v1/farmer/crops and the rest of the app does not change.

import { getCrop } from "../data/cropCatalogue";

const STORAGE_KEY = "faidafarm_farm_crops";

export function loadFarmCrops() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveFarmCrops(cropIds = []) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // De-duplicate while keeping the order the farmer chose; the first crop is
    // treated as the primary one on the dashboard.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(cropIds)]));
  } catch {
    // Storage being unavailable must not block the farmer.
  }
}

export function addFarmCrop(cropId) {
  const current = loadFarmCrops();
  if (current.includes(cropId)) {
    return current;
  }

  const next = [...current, cropId];
  saveFarmCrops(next);
  return next;
}

export function removeFarmCrop(cropId) {
  const next = loadFarmCrops().filter((id) => id !== cropId);
  saveFarmCrops(next);
  return next;
}

// The farmer's main crop - the first one they chose. Used where the UI can only
// show one crop, such as the dashboard headline and the assistant's prompts.
export function getPrimaryCropName(fallback = "") {
  const ids = loadFarmCrops();
  if (!ids.length) {
    return fallback;
  }

  const crop = getCrop(ids[0]);
  return crop ? crop.name : fallback;
}
