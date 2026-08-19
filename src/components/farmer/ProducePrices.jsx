// What things sell for, in the unit they are actually sold in.
//
// A shopper knows sukuma wiki as a 30-bob hand-fold and a goat as one animal
// you agree a price for. Showing either "per kg" would be meaningless, so the
// unit leads and the price follows it.

import { useState } from "react";
import { ArrowRight, MessageSquare, TrendingUp } from "lucide-react";
import {
  PRODUCE_CATEGORIES,
  formatRange,
  getProduceByCategory,
  getSpreadPct,
  unitOf,
} from "../../data/produceCatalogue";

function SpreadTag({ pct }) {
  // A wide gap is where moving produce can pay; a thin one is where it cannot.
  const wide = pct >= 40;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
        wide ? "bg-[#FDF4E7] text-[#B77A18]" : "bg-[#F1F6EE] text-[#2F8F46]"
      }`}
    >
      <TrendingUp size={11} />
      {pct}% more
    </span>
  );
}

function ProduceCard({ item }) {
  const unit = unitOf(item);

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#EEF2EC] bg-white">
      <div className="aspect-[4/3] w-full bg-[#F1F6EE]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-[16px] font-bold text-[#182118]">{item.name}</h4>
            <p className="truncate text-xs text-[#8A958A]">
              Sold per {unit.label}
              {unit.note ? ` · ${unit.note}` : ""}
            </p>
          </div>
          <SpreadTag pct={getSpreadPct(item)} />
        </div>

        <dl className="mt-3 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-xs text-[#667164]">Farm gate</dt>
            <dd className="text-sm font-semibold tabular-nums text-[#182118]">
              {formatRange(item.farmGate)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-xs text-[#667164]">Market</dt>
            <dd className="text-sm font-bold tabular-nums text-[#166534]">
              {formatRange(item.market)}
            </dd>
          </div>
        </dl>

        {item.quotation ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#FDF8EE] px-2.5 py-2 text-[11px] leading-4 text-[#7A5510]">
            <MessageSquare size={12} className="mt-0.5 shrink-0" />
            Price is agreed with the buyer after they see the animal
          </p>
        ) : null}

        <p className="mt-2.5 text-[11px] leading-4 text-[#8A958A]">{item.note}</p>
      </div>
    </article>
  );
}

export default function ProducePrices({ compact = false }) {
  const [category, setCategory] = useState("vegetables");
  const items = getProduceByCategory(category);

  return (
    <div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PRODUCE_CATEGORIES.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setCategory(option.id)}
            aria-pressed={category === option.id}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              category === option.id
                ? "border-[#166534] bg-[#166534] text-white"
                : "border-[#E4EAE1] bg-white text-[#4C574D]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className={`mt-4 grid gap-3 ${
          compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {items.map((item) => (
          <ProduceCard key={item.id} item={item} />
        ))}
      </div>

      <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-4 text-[#A0AA9E]">
        <ArrowRight size={12} className="mt-0.5 shrink-0" />
        Typical ranges, not quotes. Prices move with season, and livestock climbs before
        Christmas and Easter.
      </p>
    </div>
  );
}
