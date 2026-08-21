// Turning a fresh Firebase sign-in into a stored FaidaFarm session.
//
// Login and signup both end here, so the rule about who a user is lives in one
// place: the backend decides, and the client only carries the token.

import { ApiError, isApiConfigured, verifySession } from "../lib/apiClient";
import { signOutOfFirebase } from "./firebaseAuth";
import { clearStoredUser, setStoredUser } from "./session";

/**
 * Exchanges a verified Firebase ID token for a stored session, and returns it.
 *
 * If the backend rejects the token the sign-in fails, because that is a real
 * authentication answer. If the backend merely cannot be reached - asleep, down,
 * no signal - the farmer still gets in on their verified Firebase identity
 * rather than being locked out of an app that works offline anyway.
 */
export async function startSession({ idToken, profile, loginMode, county = "" }) {
  let account = null;

  if (isApiConfigured()) {
    try {
      const verified = await verifySession(idToken);
      account = verified?.user || null;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 0;
      if (status === 401 || status === 403) {
        throw error;
      }
      console.warn("Signed in, but the FaidaFarm API did not confirm the session.", error);
    }
  }

  const user = {
    id: account?.id || profile.uid,
    role: account?.role || "farmer",
    name: account?.full_name || profile.name || "Farmer",
    email: account?.email || profile.email || "",
    phone: account?.phone || "",
    // The backend keeps no county yet, so signup's answer is all there is.
    county: String(county || "").trim(),
    organization: "",
    crops: [],
    loginMode,
    photoUrl: profile.photoUrl || "",
  };

  setStoredUser(user);
  return user;
}

/**
 * Ends the session on both sides.
 *
 * Clearing the stored user alone only forgets who was here: Firebase would
 * still hold the sign-in, so the next "Continue with Google" would walk
 * straight back into the same account without asking. Logging out has to mean
 * logging out.
 */
export async function endSession() {
  clearStoredUser();

  try {
    await signOutOfFirebase();
  } catch (error) {
    // The stored session is already gone, which is the part the user sees.
    console.warn("Signed out locally, but Firebase sign-out failed.", error);
  }
}
