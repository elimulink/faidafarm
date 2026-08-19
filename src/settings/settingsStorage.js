import { getStoredUser, setStoredUser } from "../auth/session";

const THEME_KEY = "faidafarm_theme";
const DEFAULT_THEME = "light";

export function getStoredTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return window.localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

export function applyAppTheme(theme) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const nextTheme = theme || DEFAULT_THEME;
  const resolvedTheme =
    nextTheme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : nextTheme === "dark"
        ? "dark"
        : "light";

  window.localStorage.setItem(THEME_KEY, nextTheme);
  document.documentElement.dataset.appTheme = resolvedTheme;
  document.documentElement.dataset.appThemePreference = nextTheme;
}

export function buildSettingsUser(user) {
  const storedTheme = getStoredTheme();
  const preferences = user?.preferences || {};

  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    county: user?.county || "",
    organization: user?.organization || "",
    role: user?.role || "farmer",
    preferences: {
      theme: preferences.theme || storedTheme,
      language: preferences.language || "English",
      notifications: preferences.notifications ?? true,
      syncAlerts: preferences.syncAlerts ?? true,
      compactLayout: preferences.compactLayout ?? false,
    },
    security: {
      passwordUpdatedAt: user?.security?.passwordUpdatedAt || null,
      emailUpdatedAt: user?.security?.emailUpdatedAt || null,
    },
  };
}

export function saveSettingsUser(updates) {
  const currentUser = getStoredUser() || {};
  const mergedUser = {
    ...currentUser,
    ...updates,
    preferences: {
      ...(currentUser.preferences || {}),
      ...(updates.preferences || {}),
    },
    security: {
      ...(currentUser.security || {}),
      ...(updates.security || {}),
    },
  };

  setStoredUser(mergedUser);
  return mergedUser;
}
