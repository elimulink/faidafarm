import { useMemo, useState } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import {
  ActionButton,
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import MarketComparison from "../../components/charts/MarketComparison";
import PriceTrendChart from "../../components/charts/PriceTrendChart";
import {
  PRICE_UNIT,
  getMarketInsight,
  getPriceStats,
  markets,
  priceHistory,
} from "../../data/marketData";
import { farmOverview } from "../../data/farmerDashboardData";
import { getPrimaryCropName } from "../../farm/cropStorage";

const RANGES = [
  { id: 7, label: "7 days" },
  { id: 14, label: "2 weeks" },
  { id: 30, label: "30 days" },
];

function useMarket(rangeDays) {
  return useMemo(() => {
    const series = priceHistory.slice(-rangeDays);
    const stats = getPriceStats(priceHistory, rangeDays);
    return { series, stats, insight: getMarketInsight(stats) };
  }, [rangeDays]);
}

function PriceHeadline({ stats, crop, compact = false }) {
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
          <span className="ml-1 text-base font-semibold text-[#8A958A]">/kg</span>
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

function InsightCard({ insight }) {
  return (
    <div className="rounded-[22px] border border-[#E4EBDD] bg-[#F7FBF5] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F8F46]">
          <Info size={16} />
        </span>
        <div>
          <p className="text-[15px] font-bold text-[#20562B]">{insight.headline}</p>
          <p className="mt-1 text-sm leading-6 text-[#4C574D]">{insight.detail}</p>
        </div>
      </div>
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
  const { series, stats, insight } = useMarket(rangeDays);
  const crop = getPrimaryCropName(farmOverview.cropName);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <PriceHeadline stats={stats} crop={crop} />
            <RangeTabs value={rangeDays} onChange={setRangeDays} />
          </div>

          <div className="mt-5">
            <PriceTrendChart series={series} unit={PRICE_UNIT} height={220} label={`${crop} price`} />
          </div>

          <div className="mt-5">
            <InsightCard insight={insight} />
          </div>

          <div className="mt-5">
            <ActionButton to="/sell-smart">See what this means for selling</ActionButton>
          </div>
          <SampleDataNote />
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>What each market pays</SectionTitle>
          <p className="mt-1 text-sm text-[#667164]">
            Today&apos;s offer per market, with distance from your farm.
          </p>
          <div className="mt-5">
            <MarketComparison markets={markets} unit={PRICE_UNIT} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileContent() {
  const [rangeDays, setRangeDays] = useState(7);
  const { series, stats, insight } = useMarket(rangeDays);
  const crop = getPrimaryCropName(farmOverview.cropName);

  return (
    <div className="space-y-4">
      <MobileCard>
        <PriceHeadline stats={stats} crop={crop} compact />
        <div className="mt-4">
          <RangeTabs value={rangeDays} onChange={setRangeDays} />
        </div>
        <div className="mt-3">
          <PriceTrendChart series={series} unit={PRICE_UNIT} height={180} label={`${crop} price`} />
        </div>
        <SampleDataNote />
      </MobileCard>

      <MobileCard>
        <InsightCard insight={insight} />
      </MobileCard>

      <MobileCard>
        <h3 className="text-lg font-bold text-[#1F2B1F]">What each market pays</h3>
        <p className="mt-1 text-sm text-[#667164]">Today&apos;s offer and distance from your farm.</p>
        <div className="mt-4">
          <MarketComparison markets={markets} unit={PRICE_UNIT} />
        </div>
      </MobileCard>
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
