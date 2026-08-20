// Firebase client, configured from environment rather than hardcoded.
//
// The values come from the Web app registered in the Firebase console. They are
// not secrets - a Firebase web config ships in every client and is safe to
// expose - but they differ between projects, so they belong in .env rather than
// in the source.
//
// If the config is absent the app still runs; it just cannot sign in, and
// isFirebaseConfigured() lets the UI say so plainly instead of throwing.

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

let app = null;
let auth = null;

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(config);
  }
  if (!auth) {
    auth = getAuth(app);
  }

  return auth;
}

export { config as firebaseConfig };
