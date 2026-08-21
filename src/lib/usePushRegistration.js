// Keeps this phone subscribed to its owner's notifications.
//
// Mounted once, high in the tree, because the tap handler needs the router and
// the plugin only lets one set of listeners be bound at a time.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../auth/session";
import { api, isApiConfigured } from "./apiClient";
import { enablePush, pushRoute } from "./push";

export function usePushRegistration() {
  const navigate = useNavigate();

  useEffect(() => {
    // No account means nothing to subscribe, and no backend means nowhere to
    // send the token. Either way the tray simply stays quiet.
    if (!getStoredUser() || !isApiConfigured()) {
      return;
    }

    let cancelled = false;

    enablePush({
      onToken: (token) => {
        if (cancelled) {
          return;
        }
        api.post("/notifications/devices", { token, platform: "android" }).catch((error) => {
          // Not fatal: the alerts list still shows everything. Only the tray
          // goes quiet, and the next sign-in tries again.
          console.warn("[push] the backend did not accept this device token", error);
        });
      },
      onTap: (category) => {
        navigate(pushRoute(category));
      },
    });

    return () => {
      cancelled = true;
    };
    // getStoredUser reads localStorage rather than state, so this runs on mount
    // and after each navigation that remounts the app - enough to catch a fresh
    // sign-in, and harmless to repeat because registering is idempotent.
  }, [navigate]);
}
