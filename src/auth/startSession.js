// Turning a fresh Firebase sign-in into a stored FaidaFarm session.
//
// Login and signup both end here, so the rule about who a user is lives in one
// place: the backend decides, and the client only carries the token.

import { ApiError, api, isApiConfigured, verifySession } from "../lib/apiClient";
import { currentPushToken, disablePush, enablePush } from "../lib/push";
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

  // Subscribe this phone to its owner's notifications. Deliberately not
  // awaited: the permission prompt is Android's to run in its own time, and a
  // farmer who declines it - or a phone with no Play Services - must still get
  // all the way in. The alerts list carries everything regardless.
  if (isApiConfigured()) {
    enablePush({
      onToken: (token) => {
        api.post("/notifications/devices", { token, platform: "android" }).catch((error) => {
          console.warn("[push] the backend did not accept this device token", error);
        });
      },
    });
  }

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
  const pushToken = currentPushToken();

  // Cleared first and synchronously, because callers navigate away the moment
  // this is called and the route guard reads storage on the way out.
  clearStoredUser();

  // Unregister before signing out of Firebase, not after: the call is
  // authenticated, and once Firebase has signed out there is no token to send.
  // Otherwise the next person to use this phone would keep getting alerts
  // meant for the last one.
  if (pushToken && isApiConfigured()) {
    try {
      await api.delete(`/notifications/devices/${encodeURIComponent(pushToken)}`);
    } catch (error) {
      console.warn("[push] this device could not be unregistered", error);
    }
  } else if (isApiConfigured()) {
    // Silence here would be indistinguishable from success while the phone
    // stayed subscribed, which is exactly how this went unnoticed once.
    console.warn("[push] no token to unregister; this device may still be subscribed");
  }

  await disablePush();

  try {
    await signOutOfFirebase();
  } catch (error) {
    // The stored session is already gone, which is the part the user sees.
    console.warn("Signed out locally, but Firebase sign-out failed.", error);
  }
}
