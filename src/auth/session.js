import { RESEARCH_WORKSPACE_ENABLED } from "../config/features";

const STORAGE_KEY = "faidafarm_user";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function buildDisplayName(identifier, fallback) {
  const cleaned = String(identifier || "").trim();
  if (!cleaned) {
    return fallback;
  }

  const firstChunk = cleaned.split(/[@\s]/)[0];
  const safeLabel = firstChunk.replace(/[^a-zA-Z0-9]/g, " ").trim();
  return safeLabel || fallback;
}

export function inferRoleFromLogin({ loginMode, email, phone }) {
  // Research roles only lead somewhere on localhost. In a production build the
  // farmer workspace is the only one mounted, so everyone signs in as a farmer.
  if (!RESEARCH_WORKSPACE_ENABLED) {
    return "farmer";
  }

  const source = normalizeText(loginMode === "email" ? email : phone);

  if (source.includes("admin")) {
    return "admin";
  }

  if (source.includes("research")) {
    return "researcher";
  }

  if (source.includes("supervisor")) {
    return "supervisor";
  }

  if (source.includes("analyst")) {
    return "analyst";
  }

  if (source.includes("viewer")) {
    return "viewer";
  }

  if (source.includes("field")) {
    return "field_officer";
  }

  return "farmer";
}

export function createMockUser({
  loginMode,
  email,
  phone,
  preferredRole,
  name,
  county,
  organization,
  crops = [],
}) {
  const inferredRole = inferRoleFromLogin({ loginMode, email, phone });
  const requestedRole = RESEARCH_WORKSPACE_ENABLED ? preferredRole : "farmer";
  const role =
    requestedRole === "research"
      ? inferredRole === "farmer"
        ? "researcher"
        : inferredRole
      : requestedRole || inferredRole;
  const identifier = loginMode === "email" ? email : phone;

  return {
    id: `mock-${role}-${Date.now()}`,
    role,
    name:
      String(name || "").trim() ||
      buildDisplayName(identifier, role === "farmer" ? "Farmer User" : "Research User"),
    county: String(county || "").trim(),
    organization: String(organization || "").trim(),
    crops: Array.isArray(crops) ? crops : [],
    loginMode,
  };
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
