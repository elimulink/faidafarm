// Listings a farmer or dealer has submitted to offer on FaidaFarm.
//
// Nothing a user submits appears in the public catalogue on its own: it is held
// as `pending` until a person at FaidaFarm approves it. That review is a
// backend job - this module only records the submission and its state, so the
// farmer can see exactly where their listing stands.

const STORAGE_KEY = "faidafarm_my_listings";

export const LISTING_STATUS = {
  pending: {
    id: "pending",
    label: "Waiting for approval",
    detail:
      "A member of the FaidaFarm team checks every listing before it goes live, usually within two working days.",
    tone: "#B77A18",
    surface: "#FDF8EE",
  },
  approved: {
    id: "approved",
    label: "Live",
    detail: "Farmers can find this listing and contact you.",
    tone: "#2F8F46",
    surface: "#F1F6EE",
  },
  rejected: {
    id: "rejected",
    label: "Needs changes",
    detail: "Something in the listing could not be verified. Edit it and submit again.",
    tone: "#C2542F",
    surface: "#FBEEE9",
  },
};

export function loadMyListings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage problems must not lose the farmer's work silently elsewhere.
  }
}

export function submitListing(draft) {
  const listing = {
    ...draft,
    id: `mine-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: "pending",
    submittedAt: Date.now(),
  };

  const next = [listing, ...loadMyListings()];
  persist(next);
  return listing;
}

export function withdrawListing(id) {
  const next = loadMyListings().filter((item) => item.id !== id);
  persist(next);
  return next;
}
