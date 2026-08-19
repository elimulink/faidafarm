// What things sell for, in the unit they are actually sold in.
//
// Laid out the way a shopping app lays out products: photo, then the full name
// on two lines, then the price. The name is never truncated to one line - a
// card reading "She..." tells nobody anything.

import { useState } from "react";
import {
  PRODUCE_CATEGORIES,
  formatRange,
  getProduceByCategory,
  getSpreadPct,
  unitOf,
} from "../../data/produceCatalogue";

function ProduceCard({ item }) {
  const unit = unitOf(item);
  const spread = getSpreadPct(item);

  return (
    <article>
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#F1F6EE]">
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

      {/* Two lines, wrapping - never clipped to a single line. */}
      <h4 className="mt-2 line-clamp-2 text-[14.5px] font-semibold leading-snug text-[#182118]">
        {item.name}
      </h4>

      <p className="mt-1 text-[17px] font-bold leading-tight text-[#166534]">
        {formatRange(item.market)}
      </p>
      <p className="text-[11.5px] text-[#8A958A]">
        per {unit.label}
        {unit.note ? ` · ${unit.note}` : ""}
      </p>

      <p className="mt-1 text-[11.5px] text-[#667164]">
        Farm gate {formatRange(item.farmGate)}
        <span className="text-[#8A958A]"> · {spread}% less</span>
      </p>

      {item.quotation ? (
        <p className="mt-1 text-[11px] font-semibold text-[#B77A18]">
          Price agreed after viewing
        </p>
      ) : null}
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
        className={`mt-4 grid gap-x-4 gap-y-6 ${
          compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4 xl:grid-cols-6"
        }`}
      >
        {items.map((item) => (
          <ProduceCard key={item.id} item={item} />
        ))}
      </div>

      <p className="mt-5 text-[11px] leading-4 text-[#A0AA9E]">
        Typical ranges, not quotes. Livestock climbs before Christmas and Easter.
      </p>
    </div>
  );
}
