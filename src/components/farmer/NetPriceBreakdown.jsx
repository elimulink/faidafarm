// What the farmer keeps, and why.
//
// The itemised view matters more than the total: a farmer who can see
// "transport 4.56" can tell us we are wrong about the lorry. A farmer shown
// only a final number cannot.

import { useState } from "react";
import { ChevronDown, Truck } from "lucide-react";

function Row({ label, value, tone = "" }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-[#667164]">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${tone || "text-[#182118]"}`}>
        {value}
      </span>
    </div>
  );
}

export default function NetPriceBreakdown({ buyer, net, quantityKg }) {
  const [open, setOpen] = useState(false);

  if (!net.farmerDelivers) {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#2F8F46]">
        <Truck className="h-3.5 w-3.5" />
        Buyer collects, so nothing comes off the price
      </p>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#667164] underline decoration-dotted underline-offset-2"
      >
        Why {net.deductionsPerKg.toFixed(2)} comes off
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl bg-[#F7F9F6] px-3 py-2.5">
          <Row label={`Offer for ${quantityKg.toLocaleString()} kg`} value={`${buyer.offerPerKg.toFixed(2)}/kg`} />
          <Row
            label={`Transport (${net.trip.vehicle?.label}, ${net.trip.roundTripKm} km round trip)`}
            value={`-${net.transportPerKg.toFixed(2)}/kg`}
            tone="text-[#C2542F]"
          />
          <Row
            label={`Offloading (${net.bags} bags)`}
            value={`-${net.offloadPerKg.toFixed(2)}/kg`}
            tone="text-[#C2542F]"
          />
          <Row label="Cess" value={`-${net.cessPerKg.toFixed(2)}/kg`} tone="text-[#C2542F]" />

          <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-[#E4EAE1] pt-2">
            <span className="text-xs font-bold text-[#182118]">You keep</span>
            <span className="text-xs font-bold tabular-nums text-[#166534]">
              {net.netPerKg.toFixed(2)}/kg · KES {net.netKes.toLocaleString()}
            </span>
          </div>

          <p className="mt-2 text-[10.5px] leading-4 text-[#8A958A]">
            Lorry hire estimated at KES {net.trip.hireKes.toLocaleString()} for the round trip.
            Your own day is not counted. Correct these figures if your costs differ.
          </p>
        </div>
      ) : null}
    </div>
  );
}
