// Multi-select crop chooser, shared by onboarding, signup and My Farm.
//
// A farmer with ndengu and maize picks both; nothing here assumes a single crop.

import { useMemo, useState } from "react";
import { Check, Search, Sprout } from "lucide-react";
import { cropCategories, crops as allCrops, searchCrops } from "../../data/cropCatalogue";
import { cropImageCredits } from "../../data/cropImageCredits";

function CropTile({ crop, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(crop.id)}
      aria-pressed={selected}
      className={`group relative overflow-hidden rounded-[20px] border-2 text-left transition ${
        selected ? "border-[#166534] bg-[#F1F6EE]" : "border-[#E7ECE5] bg-white"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F6EE]">
        <img
          src={crop.image}
          alt={crop.name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        {selected ? (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#166534] text-white shadow">
            <Check size={15} />
          </span>
        ) : null}
      </div>
      <div className="px-3 py-2.5">
        <p className="truncate text-sm font-bold text-[#182118]">{crop.name}</p>
        <p className="truncate text-xs text-[#8A958A]">{crop.aliases[0] || crop.category}</p>
      </div>
    </button>
  );
}

function ImageCredits() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="text-[11px] font-semibold text-[#8A958A] underline decoration-dotted underline-offset-2"
      >
        Crop photo credits
      </button>
      {open ? (
        <ul className="mt-2 space-y-1">
          {cropImageCredits.map((credit) => (
            <li key={credit.crop} className="text-[10.5px] leading-4 text-[#8A958A]">
              <span className="font-semibold">{credit.crop}</span>: {credit.title} by{" "}
              {credit.artist} ({credit.license}) via{" "}
              <a
                href={credit.source}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Wikimedia Commons
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function CropPicker({
  selected = [],
  onChange,
  showSearch = true,
  showCredits = true,
  minLabel = "",
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const visible = useMemo(() => {
    const matched = searchCrops(query);
    return category === "all" ? matched : matched.filter((crop) => crop.category === category);
  }, [query, category]);

  const toggle = (cropId) => {
    onChange(
      selected.includes(cropId)
        ? selected.filter((id) => id !== cropId)
        : [...selected, cropId]
    );
  };

  return (
    <div>
      {showSearch ? (
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A958A]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search crop, e.g. ndengu or sukuma wiki"
              aria-label="Search crops"
              className="w-full rounded-2xl border border-[#E4EAE1] bg-white py-3 pl-12 pr-4 text-sm text-[#182118] outline-none placeholder:text-[#8A958A] focus:border-[#2F8F46]"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {["all", ...cropCategories].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === option
                    ? "border-[#166534] bg-[#166534] text-white"
                    : "border-[#E4EAE1] bg-white text-[#4C574D]"
                }`}
              >
                {option === "all" ? "All crops" : option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {visible.map((crop) => (
          <CropTile
            key={crop.id}
            crop={crop}
            selected={selected.includes(crop.id)}
            onToggle={toggle}
          />
        ))}
      </div>

      {!visible.length ? (
        <div className="mt-4 rounded-[20px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-4 py-8 text-center">
          <Sprout className="mx-auto h-7 w-7 text-[#2F8F46]" />
          <p className="mt-2 text-sm text-[#667164]">
            No crop matches &ldquo;{query}&rdquo;. We are adding more crops.
          </p>
        </div>
      ) : null}

      <p className="mt-4 text-sm font-medium text-[#667164]">
        {selected.length
          ? `${selected.length} crop${selected.length === 1 ? "" : "s"} selected`
          : minLabel || "Select at least one crop"}
        {allCrops.length ? ` · ${allCrops.length} available` : ""}
      </p>

      {showCredits ? <ImageCredits /> : null}
    </div>
  );
}
