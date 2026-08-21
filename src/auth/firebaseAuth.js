// Signing in, on both platforms.
//
// The two platforms take genuinely different routes, and conflating them was a
// bug worth spelling out:
//
//   Android - @capacitor-firebase/authentication signs in to Firebase NATIVELY,
//             using the config already inside google-services.json. It needs no
//             web config and no JS SDK at all.
//   Browser - the Firebase JS SDK, which does need the web config from a Web
//             app registered in the console.
//
// So Android works as soon as google-services.json has an OAuth client, and only
// the browser waits on VITE_FIREBASE_*.
//
// Either way the backend trusts nothing but the ID token, which it verifies
// against Firebase before creating a session. No password ever reaches our
// server - Firebase holds them - and no client decides who it is.

import { Capacitor } from "@capacitor/core";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../lib/firebase";

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      "Sign-in needs the Firebase web config. Register a Web app in the Firebase console and add its values to .env.local."
    );
    this.name = "AuthNotConfiguredError";
  }
}

const isNative = () => Capacitor.isNativePlatform();

// A first sign-in on a device can genuinely take a while - Play Services may be
// fetching - but it must not hang forever behind a "Signing in..." label with
// no way out.
const SIGN_IN_TIMEOUT_MS = 90000;
const TOKEN_TIMEOUT_MS = 30000;

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// The plugin object is a Capacitor proxy, and the proxy answers EVERY property
// access with a native method - including `then`. That makes it look like a
// thenable, so `return FirebaseAuthentication` from an async function has the
// promise machinery call `then()` on the bridge, which fails with
// `"FirebaseAuthentication.then()" is not implemented on android`.
//
// Wrapping it in a plain object keeps the proxy away from the promise chain.
let nativeModule = null;

async function nativePlugin() {
  if (!nativeModule) {
    const imported = await import("@capacitor-firebase/authentication");
    nativeModule = { api: imported.FirebaseAuthentication };
  }
  // Returns the box, not `.api` - unwrapping here would hand the proxy back to
  // the promise chain and hit the exact same `then()` call.
  return nativeModule;
}

/** True when this platform can sign in at all. */
export function isAuthAvailable() {
  return isNative() || isFirebaseConfigured();
}

export const canSignInWithGoogle = isAuthAvailable;

function requireWebAuth() {
  if (!isFirebaseConfigured()) {
    throw new AuthNotConfiguredError();
  }
  return getFirebaseAuth();
}

// Firebase reports failures as codes on the web and as codes buried in messages
// on Android. A farmer should read neither, so both are mapped to one plain
// sentence. Anything unrecognised keeps its own message rather than being
// flattened into something vague.
const MESSAGES_BY_CODE = {
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/invalid-login-credentials": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "No account uses that email. Create one first.",
  "auth/invalid-email": "That does not look like an email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/email-already-in-use": "An account already uses that email. Sign in instead.",
  "auth/weak-password": "Use a password of at least 6 characters.",
  "auth/missing-password": "Enter your password.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
  "auth/network-request-failed": "Could not reach Google. Check your connection.",
  "auth/popup-closed-by-user": "The Google window closed before sign-in finished.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/operation-not-allowed": "That sign-in method is switched off in Firebase.",
};

export function describeAuthError(error, fallback = "Sign-in did not complete. Please try again.") {
  if (error instanceof AuthNotConfiguredError) {
    return error.message;
  }

  const code = String(error?.code || "").toLowerCase();
  if (MESSAGES_BY_CODE[code]) {
    return MESSAGES_BY_CODE[code];
  }

  // Android surfaces the code inside the message, e.g. "... auth/invalid-credential",
  // or gives the Firebase SDK's own English sentence instead.
  const message = String(error?.message || "");
  const matched = Object.keys(MESSAGES_BY_CODE).find((key) => message.includes(key));
  if (matched) {
    return MESSAGES_BY_CODE[matched];
  }

  if (/password is invalid|auth credential is incorrect|malformed or has expired/i.test(message)) {
    return MESSAGES_BY_CODE["auth/invalid-credential"];
  }
  if (/no user record|there is no user/i.test(message)) {
    return MESSAGES_BY_CODE["auth/user-not-found"];
  }
  if (/email address is already in use/i.test(message)) {
    return MESSAGES_BY_CODE["auth/email-already-in-use"];
  }
  if (/at least 6 characters/i.test(message)) {
    return MESSAGES_BY_CODE["auth/weak-password"];
  }
  if (/network error|unable to resolve host|timed out/i.test(message)) {
    return MESSAGES_BY_CODE["auth/network-request-failed"];
  }

  return message || fallback;
}

function profileFromNativeUser(user) {
  return {
    uid: user?.uid || "",
    name: user?.displayName || "",
    email: user?.email || "",
    photoUrl: user?.photoUrl || "",
  };
}

function profileFromWebUser(user) {
  return {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    photoUrl: user.photoURL || "",
  };
}

async function nativeIdToken({ forceRefresh = false } = {}) {
  const { api: FirebaseAuthentication } = await nativePlugin();
  const { token } = await withTimeout(
    FirebaseAuthentication.getIdToken({ forceRefresh }),
    TOKEN_TIMEOUT_MS,
    "Signed in, but getting the security token timed out. Try again."
  );

  if (!token) {
    throw new Error("Signed in but no security token came back.");
  }

  return token;
}

// ---------------------------------------------------------------- Google ---

async function signInWithGoogleNative() {
  const { api: FirebaseAuthentication } = await nativePlugin();

  // skipNativeAuth is false, so this completes the Firebase sign-in natively.
  const result = await withTimeout(
    FirebaseAuthentication.signInWithGoogle(),
    SIGN_IN_TIMEOUT_MS,
    "Google did not respond. Check your connection and try again."
  );

  const user = result?.user || (await FirebaseAuthentication.getCurrentUser())?.user;

  return { idToken: await nativeIdToken(), profile: profileFromNativeUser(user) };
}

async function signInWithGoogleWeb() {
  const auth = requireWebAuth();
  const provider = new GoogleAuthProvider();
  // Always ask which account rather than silently reusing the last one.
  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await withTimeout(
    signInWithPopup(auth, provider),
    SIGN_IN_TIMEOUT_MS,
    "The Google window did not complete. Check it was not blocked, and try again."
  );

  return {
    idToken: await credential.user.getIdToken(),
    profile: profileFromWebUser(credential.user),
  };
}

export async function signInWithGoogle() {
  return isNative() ? signInWithGoogleNative() : signInWithGoogleWeb();
}

// -------------------------------------------------------- Email/password ---

export async function signInWithEmail({ email, password }) {
  const address = String(email || "").trim();

  if (isNative()) {
    const { api: FirebaseAuthentication } = await nativePlugin();
    const result = await withTimeout(
      FirebaseAuthentication.signInWithEmailAndPassword({ email: address, password }),
      SIGN_IN_TIMEOUT_MS,
      "Sign-in timed out. Check your connection and try again."
    );
    const user = result?.user || (await FirebaseAuthentication.getCurrentUser())?.user;
    return { idToken: await nativeIdToken(), profile: profileFromNativeUser(user) };
  }

  const auth = requireWebAuth();
  const credential = await withTimeout(
    signInWithEmailAndPassword(auth, address, password),
    SIGN_IN_TIMEOUT_MS,
    "Sign-in timed out. Check your connection and try again."
  );

  return {
    idToken: await credential.user.getIdToken(),
    profile: profileFromWebUser(credential.user),
  };
}

export async function signUpWithEmail({ email, password, name }) {
  const address = String(email || "").trim();
  const displayName = String(name || "").trim();

  if (isNative()) {
    const { api: FirebaseAuthentication } = await nativePlugin();
    const result = await withTimeout(
      FirebaseAuthentication.createUserWithEmailAndPassword({ email: address, password }),
      SIGN_IN_TIMEOUT_MS,
      "Creating the account timed out. Check your connection and try again."
    );

    if (displayName) {
      await FirebaseAuthentication.updateProfile({ displayName });
    }

    // Forced, because the name only reaches the token on a refresh - and the
    // backend reads the name from the token, not from anything we send it.
    const idToken = await nativeIdToken({ forceRefresh: Boolean(displayName) });
    const user = (await FirebaseAuthentication.getCurrentUser())?.user || result?.user;

    return { idToken, profile: profileFromNativeUser(user) };
  }

  const auth = requireWebAuth();
  const credential = await withTimeout(
    createUserWithEmailAndPassword(auth, address, password),
    SIGN_IN_TIMEOUT_MS,
    "Creating the account timed out. Check your connection and try again."
  );

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  return {
    idToken: await credential.user.getIdToken(Boolean(displayName)),
    profile: profileFromWebUser(credential.user),
  };
}

/**
 * Sends a reset link. Firebase deliberately does not say whether the address
 * has an account, and neither should the caller.
 */
export async function sendPasswordReset(email) {
  const address = String(email || "").trim();

  if (isNative()) {
    const { api: FirebaseAuthentication } = await nativePlugin();
    await withTimeout(
      FirebaseAuthentication.sendPasswordResetEmail({ email: address }),
      TOKEN_TIMEOUT_MS,
      "Sending the reset email timed out. Try again."
    );
    return;
  }

  const auth = requireWebAuth();
  await withTimeout(
    sendPasswordResetEmail(auth, address),
    TOKEN_TIMEOUT_MS,
    "Sending the reset email timed out. Try again."
  );
}

// --------------------------------------------------------------- Session ---

export async function signOutOfFirebase() {
  if (isNative()) {
    const { api: FirebaseAuthentication } = await nativePlugin();
    await FirebaseAuthentication.signOut();
    return;
  }

  const auth = isFirebaseConfigured() ? getFirebaseAuth() : null;
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export const signOutOfGoogle = signOutOfFirebase;

/**
 * A current ID token, refreshed when asked. Every authenticated API call needs
 * one, and only this module knows which platform holds the session.
 */
export async function getIdToken({ forceRefresh = false } = {}) {
  if (isNative()) {
    const { api: FirebaseAuthentication } = await nativePlugin();
    const { token } = await FirebaseAuthentication.getIdToken({ forceRefresh });
    return token || null;
  }

  const auth = isFirebaseConfigured() ? getFirebaseAuth() : null;
  const user = auth?.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}
