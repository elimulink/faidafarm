// Where the signed-in user is kept between launches.
//
// Storage only. It used to also mint users out of whatever someone typed,
// which let onboarding hand out sessions that Firebase had never seen. Who a
// user is now comes from one place: a verified token, exchanged in
// startSession.
const STORAGE_KEY = "faidafarm_user";

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
