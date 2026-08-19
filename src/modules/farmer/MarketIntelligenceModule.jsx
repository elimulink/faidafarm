import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  ActionButton,
  AppShell,
  Card,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import MarketComparison from "../../components/charts/MarketComparison";
import PriceTrendChart from "../../components/charts/PriceTrendChart";
import ProducePrices from "../../components/farmer/ProducePrices";
import {
  getPriceSeriesForCrop,
  getPriceStats,
  markets,
} from "../../data/marketData";
import { farmOverview } from "../../data/farmerDashboardData";
import { getPrimaryCropName } from "../../farm/cropStorage";

const RANGES = [
  { id: 7, label: "7 days" },
  { id: 14, label: "2 weeks" },
  { id: 30, label: "30 days" },
];

function useMarket(rangeDays) {
  const crop = getPrimaryCropName(farmOverview.cropName);

  return useMemo(() => {
    const { series: full, unit } = getPriceSeriesForCrop(crop);
    return { series: full.slice(-rangeDays), stats: getPriceStats(full, rangeDays), unit, crop };
  }, [crop, rangeDays]);
}

function PriceHeadline({ stats, crop, unit, compact = false }) {
  const Trend = stats.rising ? TrendingUp : TrendingDown;
  const tone = stats.rising ? "text-[#2F8F46] bg-[#EEF7E8]" : "text-[#C2542F] bg-[#FBEEE9]";

  return (
    <div>
      <p className="text-sm text-[#667164]">
        {crop} · today&apos;s price
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <span
          className={`font-bold tracking-tight text-[#111711] ${compact ? "text-[34px]" : "text-[46px]"}`}
        >
          KES {stats.current}
          <span className="ml-1 text-base font-semibold text-[#8A958A]">{unit}</span>
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${tone}`}
        >
          <Trend className="h-4 w-4" />
          {stats.changePct > 0 ? "+" : ""}
          {stats.changePct}%
        </span>
      </div>
      <p className="mt-1.5 text-sm text-[#667164]">
        Ranged KES {stats.low}&ndash;{stats.high} over {stats.windowDays} days
      </p>
    </div>
  );
}

function RangeTabs({ value, onChange }) {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Price range">
      {RANGES.map((range) => (
        <button
          key={range.id}
          type="button"
          onClick={() => onChange(range.id)}
          aria-pressed={value === range.id}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            value === range.id
              ? "bg-[#166534] text-white"
              : "border border-[#E4EAE1] bg-white text-[#4C574D]"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

function SampleDataNote() {
  return (
    <p className="mt-3 text-[11px] text-[#A0AA9E]">
      Sample prices. Live market data arrives when the backend is connected.
    </p>
  );
}

function DesktopContent() {
  const [rangeDays, setRangeDays] = useState(7);
  const { series, stats, unit } = useMarket(rangeDays);
  const crop = getPrimaryCropName(farmOverview.cropName);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <PriceHeadline stats={stats} crop={crop} unit={unit} />
            <RangeTabs value={rangeDays} onChange={setRangeDays} />
          </div>

          <div className="mt-5">
            <PriceTrendChart series={series} unit={unit} height={220} label={`${crop} price`} />
          </div>


          <div className="mt-5">
            <ActionButton to="/sell-smart">See what this means for selling</ActionButton>
          </div>
          <SampleDataNote />
        </Card>
      </div>

      <div className="col-span-12">
        <Card>
          <SectionTitle>What produce sells for</SectionTitle>
          <p className="mt-1 text-sm text-[#667164]">
            Farm gate against market price, in the unit each thing is actually sold in.
          </p>
          <div className="mt-4">
            <ProducePrices />
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>What each market pays</SectionTitle>
          <p className="mt-1 text-sm text-[#667164]">
            Today&apos;s offer per market, with distance from your farm.
          </p>
          <div className="mt-5">
            <MarketComparison markets={markets} unit={unit} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileSection({ title, subtitle, children }) {
  return (
    <section className="pt-7 first:pt-2">
      {title ? (
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#8A958A]">{title}</h3>
      ) : null}
      {subtitle ? <p className="mt-1 text-sm text-[#667164]">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-3" : ""}>{children}</div>
    </section>
  );
}

function MobileContent() {
  const [rangeDays, setRangeDays] = useState(7);
  const { series, stats, unit, crop } = useMarket(rangeDays);

  // Plain sections rather than MobileCard: that component is a bordered card,
  // so wrapping each block in one drew a box inside a box down the page.
  return (
    <div className="pb-8">
      <MobileSection>
        <PriceHeadline stats={stats} crop={crop} unit={unit} compact />
        <div className="mt-4">
          <RangeTabs value={rangeDays} onChange={setRangeDays} />
        </div>
        <div className="mt-3">
          <PriceTrendChart series={series} unit={unit} height={180} label={`${crop} price`} />
        </div>
        <SampleDataNote />
      </MobileSection>

      <MobileSection
        title="What produce sells for"
        subtitle="Market price, in the unit each thing is sold in."
      >
        <ProducePrices compact />
      </MobileSection>

      <MobileSection title="What each market pays" subtitle="Today's offer and distance from you.">
        <MarketComparison markets={markets} unit={unit} />
      </MobileSection>
    </div>
  );
}

export default function MarketIntelligenceModule() {
  return (
    <AppShell
      current="market-intelligence"
      title="Market Intelligence"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Kitui"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
