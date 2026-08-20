// Continue with Google.
//
// Two paths to the same result. In a browser, Firebase's own popup flow. In the
// Android app that popup cannot work, so @capacitor-firebase/authentication
// runs the native Google chooser and hands the credential back to the Firebase
// JS SDK, leaving one signed-in user either way.
//
// The backend never trusts anything this file returns except the ID token: it
// verifies that token with the Firebase Admin SDK before creating a session.

import { Capacitor } from "@capacitor/core";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../lib/firebase";

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      "Google sign-in is not set up yet. Add the Firebase web config and enable Google as a sign-in provider."
    );
    this.name = "AuthNotConfiguredError";
  }
}

async function signInNative() {
  // Imported lazily so the browser build never pulls in the native plugin.
  const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");

  const result = await FirebaseAuthentication.signInWithGoogle();
  const idToken = result?.credential?.idToken;
  if (!idToken) {
    throw new Error("Google did not return a credential.");
  }

  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

async function signInWeb() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  // Always ask which account, rather than silently reusing the last one.
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

/**
 * Signs in with Google and returns the Firebase user plus a fresh ID token.
 * The token is what the backend verifies; nothing else here is trusted.
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) {
    throw new AuthNotConfiguredError();
  }

  const credential = Capacitor.isNativePlatform() ? await signInNative() : await signInWeb();
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

export async function signOutOfGoogle() {
  if (!isFirebaseConfigured()) {
    return;
  }

  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");
    await FirebaseAuthentication.signOut();
  }

  const auth = getFirebaseAuth();
  if (auth) {
    await firebaseSignOut(auth);
  }
}

/**
 * A current ID token, refreshed if it is close to expiry. Every authenticated
 * API call needs one of these, so it lives here rather than being cached by
 * callers who cannot know when it expires.
 */
export async function getIdToken({ forceRefresh = false } = {}) {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}
