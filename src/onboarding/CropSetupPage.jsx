// Crop setup for a farmer account that has no crops recorded yet.
//
// Reached two ways: straight after signup, and as a guard - a farmer with an
// empty crop list is sent here before any farmer page will render, because
// prices, buyers and alerts are all matched on crop and mean nothing without
// one. Existing accounts created before crops existed land here once.

import { useState } from "react";
import { ArrowRight, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CropPicker from "../components/farmer/CropPicker";
import { getCropNames } from "../data/cropCatalogue";
import { saveFarmCrops } from "../farm/cropStorage";

export default function CropSetupPage() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const canContinue = selected.length > 0;

  const finish = () => {
    if (!canContinue) {
      return;
    }

    saveFarmCrops(selected);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="min-h-[100svh] bg-white text-[#0F1A12]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[880px] flex-col px-5 pb-8 pt-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF8EE]">
            <Sprout className="h-6 w-6 text-[#2F8F46]" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F8F46]">
              Your crops
            </p>
            <p className="text-sm text-[#667164]">Step 1 of 1</p>
          </div>
        </div>

        <h1 className="mt-7 text-[32px] font-bold leading-[1.08] sm:text-[38px]">
          What do you grow?
        </h1>
        <p className="mt-3 max-w-[560px] text-base leading-7 text-[#667164]">
          Add every crop on your farm. If you grow ndengu and maize, pick both. Prices,
          buyers, weather advice and alerts are all matched to these crops, and you can
          change them any time from My Farm.
        </p>

        <div className="mt-7 flex-1">
          <CropPicker
            selected={selected}
            onChange={setSelected}
            minLabel="Select at least one crop to continue"
          />
        </div>

        {canContinue ? (
          <p className="mt-5 rounded-2xl bg-[#F1F6EE] px-4 py-3 text-sm font-medium text-[#20562B]">
            Growing: {getCropNames(selected).join(", ")}
          </p>
        ) : null}

        <button
          type="button"
          onClick={finish}
          disabled={!canContinue}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white disabled:bg-[#CFD9CB]"
        >
          Continue to my farm
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
