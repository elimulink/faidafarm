/* Native push notifications - the phone's tray, not the in-app alerts list.

   The alerts list is the record and always holds every notification; this only
   asks Android to raise the recent ones while the app is closed, the way
   M-Pesa and WhatsApp do. Web builds are skipped entirely: browser push needs
   its own service worker and VAPID setup, so calling this in a browser is a
   no-op rather than a crash. */

import { Capacitor } from "@capacitor/core";

const CHANNEL_ID = "faidafarm_default";

let registeredToken = null;
let listenersBound = false;
let pluginModule = null;

// The listeners are bound once, but the callbacks behind them are not fixed:
// registration happens at sign-in while tap routing is set up by the router,
// and whichever arrives second must not unbind the first. So the listeners
// read from here, and each enablePush call updates only what it was given.
const handlers = { onToken: null, onTap: null };

function isSupported() {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable("PushNotifications");
}

// Same Capacitor proxy trap as the auth plugin: every property access answers
// with a native method, `then` included, so the plugin travels in a box rather
// than being returned from an async function and awaited as a thenable.
async function pushPlugin() {
  if (!pluginModule) {
    const imported = await import("@capacitor/push-notifications");
    pluginModule = { api: imported.PushNotifications };
  }
  return pluginModule;
}

/** Where a tapped tray notification should land.

    Notification categories are free text on the backend, so this matches on
    what the category contains rather than on an exact list - an unrecognised
    category still opens the alerts page, which shows every notification. */
export function pushRoute(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("weather") || value.includes("rain")) return "/weather";
  if (value.includes("price") || value.includes("market")) return "/market-intelligence";
  if (value.includes("buyer")) return "/find-buyers";
  if (value.includes("sell") || value.includes("harvest")) return "/sell-smart";
  if (value.includes("tool") || value.includes("service")) return "/tools-services";

  return "/alerts";
}

/** Create the notification channel this app posts to.

    Android 8+ silently discards a notification addressed to a channel that
    does not exist - no error, no log, nothing in the tray - so a failure here
    is reported rather than swallowed. Creating a channel that already exists
    is a no-op, so this is safe on every launch, and it deliberately runs
    before any permission check because channels need none. */
export async function ensureChannel() {
  if (!isSupported() || Capacitor.getPlatform() !== "android") {
    return;
  }

  try {
    const { api: PushNotifications } = await pushPlugin();
    await PushNotifications.createChannel({
      id: CHANNEL_ID,
      name: "FaidaFarm alerts",
      description: "Prices, weather, buyers and harvest reminders",
      importance: 4, // heads-up, with sound
      visibility: 1, // shown on the lock screen
    });
  } catch (error) {
    console.error("[push] could not create the notification channel", error);
  }
}

/**
 * Ask for permission, register with FCM, and hand the token to the backend.
 *
 * Safe to call on every sign-in: re-registering the same token just refreshes
 * which account owns it. A refusal is a normal choice rather than an error -
 * the alerts list still works without the tray - so this never throws.
 */
export async function enablePush({ onToken, onTap } = {}) {
  if (!isSupported()) {
    return;
  }

  if (onToken) {
    handlers.onToken = onToken;
  }
  if (onTap) {
    handlers.onTap = onTap;
  }

  // A token that already arrived will not be re-announced by the plugin, so a
  // caller that registers after the fact still needs to hear about it.
  if (registeredToken && onToken) {
    onToken(registeredToken);
  }

  try {
    const { api: PushNotifications } = await pushPlugin();

    // Android 13+ prompts here; older versions grant silently.
    let status = await PushNotifications.checkPermissions();
    if (status.receive === "prompt" || status.receive === "prompt-with-rationale") {
      status = await PushNotifications.requestPermissions();
    }
    if (status.receive !== "granted") {
      return;
    }

    await ensureChannel();

    if (!listenersBound) {
      listenersBound = true;

      await PushNotifications.addListener("registration", (token) => {
        registeredToken = token.value;
        handlers.onToken?.(token.value);
      });

      await PushNotifications.addListener("registrationError", (error) => {
        // Reaches logcat, which is how a missing google-services.json or an
        // unregistered package name gets diagnosed on a real device.
        console.error("[push] registration failed", error);
      });

      await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        handlers.onTap?.(action?.notification?.data?.category);
      });
    }

    await PushNotifications.register();
  } catch (error) {
    console.error("[push] enable failed", error);
  }
}

/** The token currently registered with FCM, if any. */
export function currentPushToken() {
  return registeredToken;
}

/** Drop the tray registration on sign-out, so the next person to use the
    phone is not shown the previous account's notifications. */
export async function disablePush() {
  if (!isSupported()) {
    return;
  }

  try {
    const { api: PushNotifications } = await pushPlugin();
    await PushNotifications.removeAllListeners();
  } catch (error) {
    console.error("[push] disable failed", error);
  } finally {
    listenersBound = false;
    registeredToken = null;
    handlers.onToken = null;
    handlers.onTap = null;
  }
}
