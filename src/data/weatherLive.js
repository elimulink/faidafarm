// Live weather, with the sample forecast as the floor.
//
// The page must render something the moment it opens, and a farmer in the field
// may have no signal at all, so this never leaves the UI empty: it starts on the
// sample forecast and swaps in real numbers when they arrive. `live` says which
// one is on screen, so the page can be honest about it.
//
// Dates arrive from the API as ISO strings but dayLabel() calls
// toLocaleDateString on them, so they are converted here rather than in every
// caller.

import { useEffect, useState } from "react";

import { api, isApiConfigured } from "../lib/apiClient";
import { sampleForecast, place as samplePlace } from "./weatherData";

const SAMPLE = { ...sampleForecast, place: samplePlace };

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/** Reshapes the API payload into exactly what weatherData.js exports. */
export function normalizeForecast(payload) {
  if (!payload?.current || !payload?.daily?.length) {
    return null;
  }

  return {
    place: payload.place || SAMPLE.place,
    current: { ...payload.current, updatedAt: toDate(payload.current.updatedAt).getTime() },
    hourly: (payload.hourly || []).map((hour) => ({ ...hour, at: toDate(hour.at) })),
    daily: payload.daily.map((day) => ({ ...day, date: toDate(day.date) })),
    rainfallTotalMm: payload.rainfallTotalMm ?? 0,
  };
}

export function useWeather({ farmId = null } = {}) {
  const [forecast, setForecast] = useState(SAMPLE);
  const [live, setLive] = useState(false);
  // Starts false when there is no API to wait for, so the page never shows a
  // spinner for a request it will not make.
  const [loading, setLoading] = useState(isApiConfigured());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApiConfigured()) {
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const payload = await api.get(
          farmId ? `/farmer/weather/forecast?farm_id=${farmId}` : "/farmer/weather/forecast",
          { signal: controller.signal }
        );
        const normalized = normalizeForecast(payload);
        if (!cancelled && normalized) {
          setForecast(normalized);
          setLive(true);
          setError("");
        }
      } catch (caught) {
        // Sample data is already on screen; say so rather than blanking the page.
        if (!cancelled && caught?.name !== "AbortError") {
          setError(caught?.message || "Showing saved weather.");
        }
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
  }, [farmId]);

  return { ...forecast, live, loading, error };
}
