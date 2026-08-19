import { useMemo, useState } from "react";
import {
  BadgeCheck,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import NetPriceBreakdown from "../../components/farmer/NetPriceBreakdown";
import { breakEvenKg, estimateNet } from "../../data/transportData";
import {
  BUYER_CHANNELS,
  MARKET_REFERENCE_PRICE,
  buyerCounties,
  buyerCrops,
  buyers,
  getLastActiveLabel,
  getMatchReason,
  getMatchScore,
  getPricePremium,
  sortOptions,
  verificationLabels,
} from "../../data/findBuyersData";

const verificationStyles = {
  verified: { icon: ShieldCheck, className: "bg-[#EEF7E8] text-[#2F8F46]" },
  reviewed: { icon: BadgeCheck, className: "bg-[#EEF3FB] text-[#3A6EA5]" },
  unverified: { icon: ShieldAlert, className: "bg-[#FDF4E7] text-[#B77A18]" },
};

const cropOptions = [
  { value: "all", label: "All crops" },
  ...buyerCrops.map((value) => ({ value, label: value })),
];

const countyOptions = [
  { value: "all", label: "All counties" },
  ...buyerCounties.map((value) => ({ value, label: value })),
];

const sortSelectOptions = sortOptions.map((option) => ({
  value: option.id,
  label: option.label,
}));

const LOAD_PRESETS = [500, 1000, 3000, 7000];

function useBuyerFilters() {
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("all");
  const [county, setCounty] = useState("all");
  const [channel, setChannel] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [quantityKg, setQuantityKg] = useState(1000);
  // Default to what the farmer keeps, not what they are offered.
  const [sortBy, setSortBy] = useState("net");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matched = buyers.filter((buyer) => {
      if (needle) {
        const haystack = [buyer.name, buyer.town, buyer.county, buyer.type, ...buyer.crops]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) {
          return false;
        }
      }

      if (crop !== "all" && !buyer.crops.includes(crop)) {
        return false;
      }

      if (county !== "all" && buyer.county !== county) {
        return false;
      }

      if (channel !== "all" && buyer.channel !== channel) {
        return false;
      }

      if (verifiedOnly && buyer.verification !== "verified") {
        return false;
      }

      return true;
    });

    const netOf = (buyer) => estimateNet({ buyer, quantityKg }).netPerKg;

    const sorters = {
      net: (a, b) => netOf(b) - netOf(a),
      match: (a, b) => getMatchScore(b) - getMatchScore(a),
      price: (a, b) => b.offerPerKg - a.offerPerKg,
      distance: (a, b) => a.distanceKm - b.distanceKm,
      rating: (a, b) => b.rating - a.rating,
    };

    return matched.sort(sorters[sortBy] ?? sorters.net);
  }, [query, crop, county, channel, verifiedOnly, sortBy, quantityKg]);

  function reset() {
    setQuery("");
    setCrop("all");
    setCounty("all");
    setChannel("all");
    setVerifiedOnly(false);
    setSortBy("net");
  }

  const isFiltered =
    Boolean(query.trim()) || crop !== "all" || county !== "all" || channel !== "all" || verifiedOnly;

  return {
    channel,
    county,
    crop,
    isFiltered,
    quantityKg,
    query,
    reset,
    results,
    setChannel,
    setCounty,
    setCrop,
    setQuantityKg,
    setQuery,
    setSortBy,
    setVerifiedOnly,
    sortBy,
    verifiedOnly,
  };
}

function VerificationBadge({ verification }) {
  const style = verificationStyles[verification] ?? verificationStyles.unverified;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {verificationLabels[verification]}
    </span>
  );
}

function MatchScore({ score }) {
  return (
    <div className="flex shrink-0 flex-col items-center rounded-2xl bg-[#F1F6EE] px-3 py-2">
      <span className="text-lg font-bold leading-none text-[#166534]">{score}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#5E7A63]">
        match
      </span>
    </div>
  );
}

function PriceBlock({ buyer, net }) {
  const premium = getPricePremium(buyer);
  const tone = premium > 0 ? "text-[#2F8F46]" : premium < 0 ? "text-[#C2542F]" : "text-[#667164]";

  // What lands in the farmer's pocket leads; the offer is context for it.
  return (
    <div>
      <p className="text-xl font-bold text-[#166534]">
        KES {net.netPerKg.toFixed(2)}
        <span className="text-sm font-semibold text-[#8A958A]">/kg kept</span>
      </p>
      <p className="text-xs font-semibold text-[#667164]">
        Offers {buyer.offerPerKg}/kg ·{" "}
        <span className={tone}>
          {premium > 0 ? "+" : ""}
          {premium}% vs market
        </span>
      </p>
    </div>
  );
}

function ChannelBadge({ channel }) {
  const meta = BUYER_CHANNELS.find((item) => item.id === channel);
  if (!meta) {
    return null;
  }

  const local = channel === "local";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
        local ? "bg-[#F1F6EE] text-[#166534]" : "bg-[#EEF3FB] text-[#3A6EA5]"
      }`}
    >
      {meta.label}
    </span>
  );
}

function LoadControl({ value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#182118]">How much are you selling?</p>
      <p className="mt-0.5 text-xs text-[#8A958A]">
        Transport is shared across the load, so this changes what each buyer is really worth.
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {LOAD_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            aria-pressed={value === preset}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              value === preset
                ? "border-[#166534] bg-[#166534] text-white"
                : "border-[#E4EAE1] bg-white text-[#4C574D]"
            }`}
          >
            {preset >= 1000 ? `${preset / 1000}t` : `${preset} kg`}
          </button>
        ))}
        <label className="flex items-center gap-1.5 rounded-2xl border border-[#E4EAE1] bg-white px-3 py-1.5">
          <input
            type="number"
            min="50"
            step="50"
            value={value}
            onChange={(event) => onChange(Math.max(50, Number(event.target.value) || 0))}
            aria-label="Load in kilograms"
            className="w-[74px] bg-transparent text-sm font-semibold text-[#182118] outline-none"
          />
          <span className="text-xs font-semibold text-[#8A958A]">kg</span>
        </label>
      </div>
    </div>
  );
}

// The comparison the page exists for: at this load, does hauling to Marikiti
// actually beat selling at the gate?
function ChannelVerdict({ quantityKg }) {
  const withNet = (buyer) => ({ buyer, net: estimateNet({ buyer, quantityKg }) });
  const best = (channel) =>
    buyers
      .filter((buyer) => buyer.channel === channel)
      .map(withNet)
      .sort((a, b) => b.net.netPerKg - a.net.netPerKg)[0];

  const local = best("local");
  const marikiti = best("marikiti");

  if (!local || !marikiti) {
    return null;
  }

  const localWins = local.net.netPerKg >= marikiti.net.netPerKg;
  const gap = Math.abs(local.net.netPerKg - marikiti.net.netPerKg);
  const breakEven = localWins
    ? breakEvenKg({ buyer: marikiti.buyer, localNetPerKg: local.net.netPerKg })
    : null;

  return (
    <div
      className={`rounded-[22px] border p-4 ${
        localWins ? "border-[#E4EBDD] bg-[#F7FBF5]" : "border-[#DCE7F1] bg-[#F3F7FC]"
      }`}
    >
      <p className="text-[15px] font-bold text-[#182118]">
        {localWins
          ? `Selling locally keeps more at ${quantityKg.toLocaleString()} kg`
          : `Marikiti is worth the trip at ${quantityKg.toLocaleString()} kg`}
      </p>
      <p className="mt-1.5 text-sm leading-6 text-[#4C574D]">
        {localWins ? (
          <>
            <strong>{local.buyer.name}</strong> keeps you KES {local.net.netPerKg.toFixed(2)}/kg.{" "}
            <strong>{marikiti.buyer.name}</strong> offers {marikiti.buyer.offerPerKg}/kg, but after
            transport and market costs you keep {marikiti.net.netPerKg.toFixed(2)} - about{" "}
            {gap.toFixed(2)}/kg less.
            {breakEven
              ? ` It only starts to pay from about ${breakEven.toLocaleString()} kg.`
              : " At this price gap it does not pay at any load."}
          </>
        ) : (
          <>
            <strong>{marikiti.buyer.name}</strong> keeps you KES {marikiti.net.netPerKg.toFixed(2)}/kg
            after transport and market costs, about {gap.toFixed(2)}/kg more than the best local
            offer. Lorry hire is around KES {marikiti.net.trip.hireKes.toLocaleString()}.
          </>
        )}
      </p>
    </div>
  );
}

function ContactActions({ buyer }) {
  const message = encodeURIComponent(
    `Hello ${buyer.name}, I am a FaidaFarm farmer with produce for sale. Are you buying at KES ${buyer.offerPerKg}/kg?`
  );
  const whatsappNumber = buyer.phone.replace(/[^0-9]/g, "");

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={`tel:${buyer.phone}`}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl border border-[#CFE3C8] bg-white px-4 py-3 text-sm font-semibold text-[#166534]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
    </div>
  );
}

function BuyerFacts({ buyer }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <div>
        <dt className="text-[#667164]">Payment</dt>
        <dd className="font-semibold text-[#182118]">{buyer.paymentTerms}</dd>
      </div>
      <div>
        <dt className="text-[#667164]">Minimum</dt>
        <dd className="font-semibold text-[#182118]">{buyer.minVolumeKg} kg</dd>
      </div>
      <div>
        <dt className="text-[#667164]">Demand</dt>
        <dd className="font-semibold text-[#2F8F46]">{buyer.demand}</dd>
      </div>
      <div>
        <dt className="text-[#667164]">Transport</dt>
        <dd className="flex items-center gap-1.5 font-semibold text-[#182118]">
          <Truck className="h-4 w-4 text-[#667164]" />
          {buyer.transport}
        </dd>
      </div>
    </dl>
  );
}

function BuyerCard({ buyer, quantityKg }) {
  const net = estimateNet({ buyer, quantityKg });

  return (
    <article className="flex flex-col rounded-[24px] border border-[#EEF2EC] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-xl font-bold text-[#182118]">{buyer.name}</h4>
          <p className="mt-1 text-sm text-[#667164]">
            {buyer.type} &middot; {buyer.town}
          </p>
        </div>
        <MatchScore score={getMatchScore(buyer)} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ChannelBadge channel={buyer.channel} />
        <VerificationBadge verification={buyer.verification} />
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#667164]">
          <Star className="h-3.5 w-3.5 fill-[#E8B93B] text-[#E8B93B]" />
          {buyer.rating} ({buyer.trades} sales)
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#667164]">
          <MapPin className="h-3.5 w-3.5" />
          {buyer.distanceKm} km
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 rounded-2xl bg-[#F7F9F6] p-4">
        <PriceBlock buyer={buyer} net={net} />
        <p className="text-right text-xs font-medium text-[#667164]">
          {getLastActiveLabel(buyer)}
        </p>
      </div>

      <NetPriceBreakdown buyer={buyer} net={net} quantityKg={quantityKg} />

      <p className="mt-3 text-sm leading-6 text-[#4C574D]">
        <span className="font-semibold text-[#166534]">Why this match: </span>
        {getMatchReason(buyer)}
      </p>

      <BuyerFacts buyer={buyer} />

      <div className="mt-5">
        <ContactActions buyer={buyer} />
      </div>
    </article>
  );
}

function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A958A]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E4EAE1] bg-white py-3 pl-12 pr-4 text-sm text-[#182118] outline-none placeholder:text-[#8A958A] focus:border-[#2F8F46]"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-[#E4EAE1] bg-white px-3 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#8A958A]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-semibold text-[#182118] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function VerifiedToggle({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-[#E4EAE1] bg-white px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#166534]"
      />
      <span className="text-sm font-semibold text-[#182118]">Verified only</span>
    </label>
  );
}

function ChannelTabs({ value, onChange }) {
  const options = [{ id: "all", label: "All buyers" }, ...BUYER_CHANNELS];

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            value === option.id
              ? "border-[#166534] bg-[#166534] text-white"
              : "border-[#E4EAE1] bg-white text-[#4C574D]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6EE]">
        <Search className="h-7 w-7 text-[#2F8F46]" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-[#182118]">No buyers match this search</h4>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667164]">
        Try a different crop or county, or clear the filters to see every buyer in your region.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white"
      >
        <X className="h-4 w-4" />
        Clear filters
      </button>
    </div>
  );
}

function DesktopContent() {
  const filters = useBuyerFilters();

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle
            action={
              <span className="text-sm font-semibold text-[#667164]">
                {filters.results.length} of {buyers.length} buyers
              </span>
            }
          >
            Find a buyer for your harvest
          </SectionTitle>

          <p className="mt-1 text-sm leading-6 text-[#667164]">
            Offers are compared against today&apos;s market price of KES {MARKET_REFERENCE_PRICE}/kg.
            The match score weighs price, distance, reliability, and demand.
          </p>

          <div className="mt-5 space-y-4">
            <LoadControl value={filters.quantityKg} onChange={filters.setQuantityKg} />
            <ChannelTabs value={filters.channel} onChange={filters.setChannel} />
            <ChannelVerdict quantityKg={filters.quantityKg} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <SearchField
              value={filters.query}
              onChange={filters.setQuery}
              placeholder="Search by buyer, town, or crop"
            />
            <SelectField
              label="Crop"
              value={filters.crop}
              options={cropOptions}
              onChange={filters.setCrop}
            />
            <SelectField
              label="County"
              value={filters.county}
              options={countyOptions}
              onChange={filters.setCounty}
            />
            <SelectField
              label="Sort"
              value={filters.sortBy}
              options={sortSelectOptions}
              onChange={filters.setSortBy}
            />
            <VerifiedToggle checked={filters.verifiedOnly} onChange={filters.setVerifiedOnly} />
            {filters.isFiltered ? (
              <button
                type="button"
                onClick={filters.reset}
                className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[#166534] hover:bg-[#F1F6EE]"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-6">
            {filters.results.length ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {filters.results.map((buyer) => (
                  <BuyerCard key={buyer.id} buyer={buyer} quantityKg={filters.quantityKg} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={filters.reset} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileBuyerCard({ buyer, quantityKg }) {
  const net = estimateNet({ buyer, quantityKg });

  return (
    <MobileCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-[#182118]">{buyer.name}</h3>
          <p className="mt-0.5 text-sm text-[#667164]">
            {buyer.type} &middot; {buyer.distanceKm} km
          </p>
        </div>
        <MatchScore score={getMatchScore(buyer)} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ChannelBadge channel={buyer.channel} />
        <VerificationBadge verification={buyer.verification} />
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#667164]">
          <Star className="h-3.5 w-3.5 fill-[#E8B93B] text-[#E8B93B]" />
          {buyer.rating}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 rounded-2xl bg-[#F7F9F6] p-3">
        <PriceBlock buyer={buyer} net={net} />
        <p className="text-right text-xs font-medium text-[#667164]">{buyer.demand} demand</p>
      </div>

      <NetPriceBreakdown buyer={buyer} net={net} quantityKg={quantityKg} />

      <p className="mt-3 text-sm leading-6 text-[#4C574D]">{getMatchReason(buyer)}</p>

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667164]">
        <div className="flex gap-1">
          <dt>Payment:</dt>
          <dd className="font-semibold text-[#182118]">{buyer.paymentTerms}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Minimum:</dt>
          <dd className="font-semibold text-[#182118]">{buyer.minVolumeKg} kg</dd>
        </div>
      </dl>

      <div className="mt-4">
        <ContactActions buyer={buyer} />
      </div>
    </MobileCard>
  );
}

function MobileContent() {
  const filters = useBuyerFilters();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <LoadControl value={filters.quantityKg} onChange={filters.setQuantityKg} />
      <ChannelTabs value={filters.channel} onChange={filters.setChannel} />
      <ChannelVerdict quantityKg={filters.quantityKg} />

      <div className="flex items-center gap-2">
        <SearchField
          value={filters.query}
          onChange={filters.setQuery}
          placeholder="Search buyers"
        />
        <button
          type="button"
          onClick={() => setShowFilters((open) => !open)}
          aria-expanded={showFilters}
          aria-label="Filters"
          className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border ${
            filters.isFiltered
              ? "border-[#166534] bg-[#F1F6EE] text-[#166534]"
              : "border-[#E4EAE1] bg-white text-[#667164]"
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {showFilters ? (
        <div className="space-y-2 rounded-[22px] border border-[#E7ECE5] bg-white p-3">
          <SelectField
            label="Crop"
            value={filters.crop}
            options={cropOptions}
            onChange={filters.setCrop}
          />
          <SelectField
            label="County"
            value={filters.county}
            options={countyOptions}
            onChange={filters.setCounty}
          />
          <SelectField
            label="Sort"
            value={filters.sortBy}
            options={sortSelectOptions}
            onChange={filters.setSortBy}
          />
          <VerifiedToggle checked={filters.verifiedOnly} onChange={filters.setVerifiedOnly} />
        </div>
      ) : null}

      <p className="px-1 text-sm font-semibold text-[#667164]">
        {filters.results.length} {filters.results.length === 1 ? "buyer" : "buyers"} found
      </p>

      {filters.results.length ? (
        filters.results.map((buyer) => (
          <MobileBuyerCard key={buyer.id} buyer={buyer} quantityKg={filters.quantityKg} />
        ))
      ) : (
        <EmptyState onReset={filters.reset} />
      )}
    </div>
  );
}

export default function FindBuyersModule() {
  return (
    <AppShell
      current="find-buyers"
      title="Find Buyers"
      subtitle="Verified buyers ranked for your harvest"
      mobileSubtitle="Kitui"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
