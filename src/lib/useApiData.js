// One fetch-with-fallback hook, so every module handles a missing backend the
// same way.
//
// The fallback policy is deliberately not uniform, because the cost of showing
// sample data differs by screen. Weather sample data is a reasonable stand-in
// when a farmer is offline. A sample BUYER is not: it is a phone number that
// does not answer and a price nobody is paying, and a farmer could load a lorry
// on the strength of it. So `fallbackOnError` defaults to false, and only
// screens where invented numbers are harmless opt in.

import { useCallback, useEffect, useRef, useState } from "react";

import { api, isApiConfigured } from "./apiClient";

export function useApiData(path, { fallback = null, adapt = (x) => x, fallbackOnError = false, enabled = true } = {}) {
  const configured = isApiConfigured() && enabled;

  const [data, setData] = useState(configured ? fallback : fallback);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  // Keeps the effect from re-running when a caller passes a fresh closure.
  // Synced in an effect rather than during render, which React forbids.
  const adaptRef = useRef(adapt);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    adaptRef.current = adapt;
    fallbackRef.current = fallback;
  });

  useEffect(() => {
    if (!configured || !path) {
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const payload = await api.get(path, { signal: controller.signal });
        if (cancelled) {
          return;
        }
        setData(adaptRef.current(payload));
        setLive(true);
        setError("");
      } catch (caught) {
        if (cancelled || caught?.name === "AbortError") {
          return;
        }
        setError(caught?.message || "Could not load this from FaidaFarm.");
        setLive(false);
        setData(fallbackOnError ? fallbackRef.current : null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [path, configured, fallbackOnError, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { data, live, loading, error, reload, configured };
}
