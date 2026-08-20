// Continue with Google.
//
// The two platforms take genuinely different routes, and conflating them was a
// bug worth spelling out:
//
//   Android - @capacitor-firebase/authentication signs in to Firebase NATIVELY,
//             using the config already inside google-services.json. It needs no
//             web config and no JS SDK at all.
//   Browser - the Firebase JS SDK popup, which does need the web config from a
//             Web app registered in the console.
//
// So Android works as soon as google-services.json has an OAuth client, and only
// the browser waits on VITE_FIREBASE_*.
//
// Either way the backend trusts nothing but the ID token, which it verifies with
// the Firebase Admin SDK before creating a session.

import { Capacitor } from "@capacitor/core";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../lib/firebase";

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      "Google sign-in needs the Firebase web config. Register a Web app in the Firebase console and add its values to .env.local."
    );
    this.name = "AuthNotConfiguredError";
  }
}

const isNative = () => Capacitor.isNativePlatform();

// A first sign-in on a device can genuinely take a while - Play Services may be
// fetching - but it must not hang forever behind a "Signing in..." label with
// no way out.
const SIGN_IN_TIMEOUT_MS = 90000;

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function nativePlugin() {
  const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");
  return FirebaseAuthentication;
}

/** True when this platform can sign in at all. */
export function canSignInWithGoogle() {
  return isNative() || isFirebaseConfigured();
}

async function signInNative() {
  const FirebaseAuthentication = await nativePlugin();

  // skipNativeAuth is false, so this completes the Firebase sign-in natively.
  const result = await withTimeout(
    FirebaseAuthentication.signInWithGoogle(),
    SIGN_IN_TIMEOUT_MS,
    "Google did not respond. Check your connection and try again."
  );

  const { token } = await withTimeout(
    FirebaseAuthentication.getIdToken(),
    30000,
    "Signed in, but getting the security token timed out. Try again."
  );

  if (!token) {
    throw new Error("Google signed in but returned no ID token.");
  }

  const user = result?.user || (await FirebaseAuthentication.getCurrentUser())?.user;

  return {
    idToken: token,
    profile: {
      uid: user?.uid || "",
      name: user?.displayName || "",
      email: user?.email || "",
      photoUrl: user?.photoUrl || "",
    },
  };
}

async function signInWeb() {
  if (!isFirebaseConfigured()) {
    throw new AuthNotConfiguredError();
  }

  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  // Always ask which account rather than silently reusing the last one.
  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await withTimeout(
    signInWithPopup(auth, provider),
    SIGN_IN_TIMEOUT_MS,
    "The Google window did not complete. Check it was not blocked, and try again."
  );
  const user = credential.user;

  return {
    idToken: await user.getIdToken(),
    profile: {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoUrl: user.photoURL || "",
    },
  };
}

export async function signInWithGoogle() {
  return isNative() ? signInNative() : signInWeb();
}

export async function signOutOfGoogle() {
  if (isNative()) {
    const FirebaseAuthentication = await nativePlugin();
    await FirebaseAuthentication.signOut();
    return;
  }

  const auth = isFirebaseConfigured() ? getFirebaseAuth() : null;
  if (auth) {
    await firebaseSignOut(auth);
  }
}

/**
 * A current ID token, refreshed when asked. Every authenticated API call needs
 * one, and only this module knows which platform holds the session.
 */
export async function getIdToken({ forceRefresh = false } = {}) {
  if (isNative()) {
    const FirebaseAuthentication = await nativePlugin();
    const { token } = await FirebaseAuthentication.getIdToken({ forceRefresh });
    return token || null;
  }

  const auth = isFirebaseConfigured() ? getFirebaseAuth() : null;
  const user = auth?.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}
