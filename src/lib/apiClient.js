// One way in to the FaidaFarm API.
//
// Every authenticated request carries a fresh Firebase ID token, because tokens
// expire after an hour and no caller can know when. A 401 is retried once with
// a forced refresh before being reported, which covers the common case of a
// token that expired between being fetched and being used.

import { getIdToken } from "../auth/firebaseAuth";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const PREFIX = "/api/v1";

export class ApiError extends Error {
  constructor(message, { status = 0, detail = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export function isApiConfigured() {
  return Boolean(BASE_URL);
}

export function apiUrl(path) {
  return `${BASE_URL}${PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
}

async function readError(response) {
  try {
    const body = await response.json();
    return body?.detail || body?.message || null;
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, auth = true, signal, forceRefresh = false } = {}) {
  if (!isApiConfigured()) {
    throw new ApiError("The API is not configured yet.", { status: 0 });
  }

  const headers = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await getIdToken({ forceRefresh });
    if (!token) {
      throw new ApiError("You are not signed in.", { status: 401 });
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    throw new ApiError("Could not reach FaidaFarm. Check your connection.", { status: 0 });
  }

  // One retry with a fresh token: the usual cause is expiry, not bad credentials.
  if (response.status === 401 && auth && !forceRefresh) {
    return request(path, { method, body, auth, signal, forceRefresh: true });
  }

  if (!response.ok) {
    throw new ApiError(
      (await readError(response)) || `Request failed (${response.status}).`,
      { status: response.status }
    );
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

/**
 * Nudges the backend awake, without waiting for it.
 *
 * The free Render tier sleeps after a quiet spell and takes the better part of
 * a minute to come back. Sign-in is the first thing that needs it, so this is
 * fired when the app opens: by the time a farmer has typed their password the
 * server is usually already up, and the wait disappears instead of being
 * explained. Failure is silence - this is an optimisation, not a dependency.
 */
export function warmUpApi() {
  if (!isApiConfigured()) {
    return;
  }

  request("/health", { auth: false }).catch(() => {});
}

/** Exchanges a Firebase ID token for a FaidaFarm user record. */
export function verifySession(idToken) {
  return request("/auth/verify", { method: "POST", body: { id_token: idToken }, auth: false });
}
