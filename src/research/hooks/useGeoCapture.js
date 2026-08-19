import { useState } from "react";
import { captureCurrentLocation } from "../fieldStorage/fieldGeo";

export default function useGeoCapture() {
  const [gps, setGps] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState("");

  async function captureGps() {
    setIsCapturing(true);
    setError("");

    try {
      const location = await captureCurrentLocation();
      setGps(location);
      return location;
    } catch (captureError) {
      setError(captureError.message);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }

  function clearGps() {
    setGps(null);
    setError("");
  }

  return { gps, isCapturing, error, captureGps, clearGps };
}
