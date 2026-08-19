import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ClipboardList, Plus, Search, Star, Wrench } from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import {
  TOOL_CATEGORIES,
  formatPrice,
  listings,
  searchListings,
} from "../../data/toolsData";
import { LISTING_STATUS, loadMyListings } from "../../tools/listingStorage";
import { toolImageCredits } from "../../data/toolImageCredits";

function VerifiedBadge({ verified }) {
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F5F3] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#7A857A]">
        Not yet verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF7E8] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#2F8F46]">
      <BadgeCheck size={11} />
      Verified
    </span>
  );
}

function ListingCard({ item }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#EEF2EC] bg-white">
      <div className="aspect-[4/3] w-full bg-[#F1F6EE]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Wrench className="h-9 w-9 text-[#2F8F46]" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">
          {item.brand}
        </p>
        <h4 className="mt-0.5 text-[17px] font-bold leading-snug text-[#182118]">{item.name}</h4>
        <p className="mt-1.5 text-sm leading-6 text-[#667164]">{item.summary}</p>

        <p className="mt-3 text-lg font-bold text-[#166534]">{formatPrice(item.price)}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VerifiedBadge verified={item.seller.verified} />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#667164]">
            <Star className="h-3.5 w-3.5 fill-[#E8B93B] text-[#E8B93B]" />
            {item.rating} ({item.reviews})
          </span>
          <span className="text-xs text-[#8A958A]">{item.seller.county}</span>
        </div>

        <Link
          to={`/tools-services/${item.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white"
        >
          Explore
        </Link>
      </div>
    </article>
  );
}

function MyListings({ items, compact = false }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={compact ? "" : "mb-6"}>
      <h4 className="text-sm font-bold text-[#182118]">Your listings</h4>
      <div className="mt-3 space-y-3">
        {items.map((item) => {
          const status = LISTING_STATUS[item.status] || LISTING_STATUS.pending;
          return (
            <div key={item.id} className="rounded-[20px] border border-[#EEF2EC] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-[#182118]">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[#8A958A]">
                    {item.brand} · KES {Number(item.priceAmount).toLocaleString()} {item.priceUnit}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
                  style={{ background: status.surface, color: status.tone }}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#667164]">{status.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useCatalogue() {
  const [category, setCategory] = useState("hire");
  const [query, setQuery] = useState("");
  const [mine] = useState(() => loadMyListings());

  const visible = useMemo(
    () => searchListings(listings.filter((item) => item.category === category), query),
    [category, query]
  );

  return { category, setCategory, query, setQuery, visible, mine };
}

function CategoryTabs({ value, onChange }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {TOOL_CATEGORIES.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
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

function ListToolCta({ compact = false }) {
  return (
    <Link
      to="/tools-services/list"
      className={`flex items-center gap-3 rounded-[22px] border border-dashed border-[#CFE3C8] bg-[#F7FBF5] px-4 ${
        compact ? "py-3.5" : "py-4"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#166534]">
        <Plus size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-[#20562B]">
          Offer your own tool or service
        </span>
        <span className="block text-xs leading-5 text-[#5F7A5F]">
          List it for hire or sale. We check every listing before it goes live.
        </span>
      </span>
    </Link>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8A958A]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tool, brand or supplier"
        aria-label="Search tools and services"
        className="w-full rounded-2xl border border-[#E4EAE1] bg-white py-3 pl-12 pr-4 text-sm text-[#182118] outline-none placeholder:text-[#8A958A] focus:border-[#2F8F46]"
      />
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-[24px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-6 py-10 text-center">
      <ClipboardList className="mx-auto h-7 w-7 text-[#2F8F46]" />
      <p className="mt-2 text-sm font-semibold text-[#182118]">Nothing matches that search</p>
      <p className="mt-1 text-sm text-[#667164]">Try another tool, brand or supplier.</p>
    </div>
  );
}

function SampleNote() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="mt-4">
      <p className="text-[11px] leading-4 text-[#A0AA9E]">
        Sample listings. Suppliers shown are placeholders until real ones are onboarded and
        verified.
      </p>
      <button
        type="button"
        onClick={() => setShowCredits((prev) => !prev)}
        aria-expanded={showCredits}
        className="mt-1 text-[11px] font-semibold text-[#8A958A] underline decoration-dotted underline-offset-2"
      >
        Equipment photo credits
      </button>
      {showCredits ? (
        <ul className="mt-2 space-y-1">
          {toolImageCredits.map((credit) => (
            <li key={credit.tool} className="text-[10.5px] leading-4 text-[#8A958A]">
              <span className="font-semibold">{credit.tool}</span>: {credit.title} by{" "}
              {credit.artist} ({credit.license}) via{" "}
              <a href={credit.source} target="_blank" rel="noreferrer" className="underline">
                Wikimedia Commons
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DesktopContent() {
  const state = useCatalogue();
  const blurb = TOOL_CATEGORIES.find((item) => item.id === state.category)?.blurb;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle
            action={
              <span className="text-sm font-semibold text-[#667164]">
                {state.visible.length} listed
              </span>
            }
          >
            Tools &amp; Services
          </SectionTitle>
          <p className="mt-1 text-sm text-[#667164]">{blurb}</p>

          <div className="mt-4 space-y-3">
            <CategoryTabs value={state.category} onChange={state.setCategory} />
            <SearchBar value={state.query} onChange={state.setQuery} />
          </div>

          <div className="mt-5">
            {state.visible.length ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {state.visible.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyResults />
            )}
          </div>
          <SampleNote />
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>Sell or hire out</SectionTitle>
          <p className="mt-1 text-sm leading-6 text-[#667164]">
            Own a tractor, sprayer or lorry that sits idle? Offer it here and reach farmers
            near you.
          </p>
          <div className="mt-4">
            <ListToolCta />
          </div>
          <div className="mt-5">
            <MyListings items={state.mine} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileContent() {
  const state = useCatalogue();

  return (
    <div className="space-y-4">
      <MobileCard>
        <SearchBar value={state.query} onChange={state.setQuery} />
        <div className="mt-3">
          <CategoryTabs value={state.category} onChange={state.setCategory} />
        </div>
        <p className="mt-3 text-sm text-[#667164]">
          {state.visible.length} listed ·{" "}
          {TOOL_CATEGORIES.find((item) => item.id === state.category)?.blurb}
        </p>
      </MobileCard>

      <MobileCard>
        <ListToolCta compact />
        {state.mine.length ? (
          <div className="mt-4">
            <MyListings items={state.mine} compact />
          </div>
        ) : null}
      </MobileCard>

      {state.visible.length ? (
        state.visible.map((item) => <ListingCard key={item.id} item={item} />)
      ) : (
        <EmptyResults />
      )}

      <SampleNote />
    </div>
  );
}

export default function ToolsServicesModule() {
  return (
    <AppShell
      current="tools-services"
      title="Tools & Services"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Kitui"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
