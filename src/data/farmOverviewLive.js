// The headline "what is growing right now" panel.
//
// Which crop the farmer grows is chosen offline and kept locally; what stage it
// is at is a record only the backend holds. This merges the two, and leaves a
// field null rather than guessing when nothing has been recorded - a progress
// bar that always reads 75% is worse than no progress bar.

import { useMemo } from "react";

import { adaptCrops } from "./adapters";
import { farmOverview as sampleOverview } from "./farmerDashboardData";
import { getPrimaryCropName } from "../farm/cropStorage";
import { useApiData } from "../lib/useApiData";

export function useFarmOverview() {
  const { data, live, loading } = useApiData("/farmer/crops", { adapt: adaptCrops, fallback: [] });
  const cropName = getPrimaryCropName(sampleOverview.cropName);

  return useMemo(() => {
    const record = (data || []).find(
      (crop) => crop.name?.toLowerCase() === String(cropName).toLowerCase()
    );

    if (!record) {
      return { ...sampleOverview, cropName, recorded: false, loading };
    }

    return {
      ...sampleOverview,
      cropName,
      stage: record.stage ?? null,
      progress: record.progress ?? null,
      harvestIn: record.harvestIn ?? null,
      health: record.health ?? null,
      expectedYield: record.expectedYield ?? null,
      recorded: true,
      live,
      loading,
    };
  }, [data, cropName, live, loading]);
}
