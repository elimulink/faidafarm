import React from "react";
import { ArrowRight, CloudRain, Sprout, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  DashboardMobileShell,
  DesktopDashboardShell,
  MobileCard,
  SimpleBars,
} from "../../components/farmer/FarmerShared";
import {
  marketRows,
  priceToday,
  quickActions,
  recommendation,
  timelineSteps,
} from "../../data/farmerDashboardData";
import PriceTrendChart from "../../components/charts/PriceTrendChart";
import { PRICE_UNIT, getMarketInsight, getPriceStats, priceHistory } from "../../data/marketData";
import { SEVERITIES, alerts as sampleAlerts, formatAlertAge } from "../../data/alertsData";
import { adaptAlerts } from "../../data/adapters";
import { useFarmOverview } from "../../data/farmOverviewLive";
import { useApiData } from "../../lib/useApiData";

function TodayHero({ compact = false }) {
  const stats = getPriceStats(priceHistory, 7);
  const insight = getMarketInsight(stats);
  const overview = useFarmOverview();
  const crop = overview.cropName;
  const holding = insight.tone === "hold";

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#DCEAD5] bg-[#F7FBF5]">
      <div className={compact ? "p-4" : "p-6"}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#166534]">
            <Sprout className="h-3.5 w-3.5" />
            Today
          </span>
          <span className="text-xs font-semibold text-[#5F7A5F]">
            {overview.stage ? `${crop} · ${overview.stage}` : crop}
          </span>
        </div>

        <h2
          className={`mt-3 font-bold leading-[1.1] tracking-tight text-[#14311D] ${
            compact ? "text-[26px]" : "text-[34px]"
          }`}
        >
          {holding ? "Hold your harvest" : "Sell sooner"}
        </h2>
        <p className="mt-2 max-w-[52ch] text-sm leading-6 text-[#3F5442]">{insight.detail}</p>

        <dl className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">Price</dt>
            <dd className="mt-1 text-lg font-bold text-[#182118]">KES {stats.current}</dd>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">7 days</dt>
            <dd className="mt-1 text-lg font-bold text-[#2F8F46]">
              {stats.changePct > 0 ? "+" : ""}
              {stats.changePct}%
            </dd>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">Harvest</dt>
            <dd className="mt-1 text-lg font-bold text-[#182118]">{overview.harvestIn || "Not recorded"}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/sell-smart"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white"
          >
            See selling advice
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/market-intelligence"
            className="inline-flex items-center rounded-2xl border border-[#CFE3C8] bg-white px-4 py-2.5 text-sm font-semibold text-[#166534]"
          >
            Price trend
          </Link>
        </div>
      </div>
    </div>
  );
}

function FarmOverviewCard() {
  const overview = useFarmOverview();

  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1F2B1F]">Farm Overview</h3>

      <div className="mt-6 flex items-start gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF5EA]">
          <Sprout className="h-11 w-11 text-[#3B8B43]" />
        </div>

        <div className="flex-1">
          <h4 className="text-[30px] font-bold leading-none text-[#1B241D]">
            {overview.cropName}
          </h4>
          {overview.stage ? (
            <div className="mt-3 inline-flex rounded-full bg-[#EAF4E6] px-3 py-1 text-sm font-medium text-[#2F6B33]">
              {overview.stage}
            </div>
          ) : null}

          {overview.harvestIn ? (
            <div className="mt-5">
              <p className="text-sm text-[#6B7468]">Harvest in</p>
              <p className="mt-1 text-[32px] font-bold leading-none text-[#141B16]">
                {overview.harvestIn}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[#6B7468]">
              No harvest date recorded for this crop yet.
            </p>
          )}
        </div>
      </div>

      {overview.progress == null ? null : (
        <div className="mt-8 flex items-center gap-4">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#E6ECE3]">
            <div
              className="h-full rounded-full bg-[#2F8F46]"
              style={{ width: `${overview.progress}%` }}
            />
          </div>
          <span className="text-base font-medium text-[#344034]">{overview.progress}%</span>
        </div>
      )}
    </Card>
  );
}

function RecommendationCard() {
  return (
    <Card className="bg-[#F4F8F1]">
      <h3 className="text-lg font-semibold text-[#1F2B1F]">Today&apos;s Recommendation</h3>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="max-w-[60%]">
          <div className="inline-flex rounded-full bg-[#E3F0DE] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2F7C33]">
            {recommendation.label}
          </div>

          <h2 className="mt-5 text-[38px] font-bold leading-[1.08] text-[#111711]">
            Wait 10 days
            <br />
            before selling
          </h2>

          <p className="mt-5 max-w-[460px] text-base leading-7 text-[#4B574C]">
            {recommendation.description}
          </p>

          <Link
            to="/sell-smart"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14582D]"
          >
            View Detailed Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex shrink-0 items-end justify-center">
          <div className="relative flex h-[190px] w-[180px] items-end justify-center rounded-[30px] bg-[#EDF6E9]">
            <TrendingUp className="absolute right-6 top-6 h-12 w-12 text-[#2F8F46]" />
            <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-[26px] bg-[#DCEED4]">
              <Sprout className="h-12 w-12 text-[#2E7D32]" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PriceTodayCard() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[#1F2B1F]">Price Today</h3>

      <div className="mt-6">
        <p className="text-sm text-[#6B7468]">{priceToday.crop}</p>

        <div className="mt-3 flex items-center gap-4">
          <div className="text-[34px] font-bold leading-none text-[#111711]">
            KES 80<span className="text-[18px] font-medium">/kg</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#EEF7E8] px-3 py-1 text-sm font-semibold text-[#2F8F46]">
            <TrendingUp className="h-4 w-4" />
            {priceToday.trend}
          </div>
        </div>

        <div className="mt-4">
          <PriceTrendChart
            series={priceHistory.slice(-7)}
            unit={PRICE_UNIT}
            height={130}
            label={`${priceToday.crop} price`}
          />
        </div>

        <Link
          to="/market-intelligence"
          className="mt-5 inline-flex rounded-2xl border border-[#D7DED4] bg-white px-5 py-3 text-sm font-semibold text-[#223022] transition hover:bg-[#F8FAF7]"
        >
          View Market Trends
        </Link>
      </div>
    </Card>
  );
}

function WeatherStrip() {
  return (
    <div className="rounded-[28px] border border-[#DCE7F1] bg-[#F3F7FC] p-6 shadow-[0_2px_12px_rgba(25,40,20,0.03)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1ECF8]">
            <CloudRain className="h-8 w-8 text-[#5383C5]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#4573B5]">Weather Alert</p>
            <h3 className="text-[24px] font-bold leading-tight text-[#1A2225]">
              Rain expected tomorrow
            </h3>
            <p className="mt-1 text-base text-[#61707B]">
              Moderate rainfall expected in your area.
            </p>
          </div>
        </div>

        <Link
          to="/weather"
          className="shrink-0 rounded-2xl border border-[#D3DCE8] bg-white px-5 py-3 text-sm font-semibold text-[#223022] transition hover:bg-[#F9FBFD]"
        >
          View Forecast
        </Link>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <Card>
      <h3 className="text-xl font-semibold text-[#1F2B1F]">Quick Actions</h3>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`rounded-[24px] border border-[#E8ECE5] ${item.accent} p-6 text-left transition hover:shadow-md`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6EE]">
                <Icon className="h-7 w-7 text-[#2F8F46]" />
              </div>
              <h4 className="mt-5 text-lg font-semibold text-[#182118]">{item.title}</h4>
              <p className="mt-3 text-[15px] leading-7 text-[#616A5F]">{item.desc}</p>
              <div className="mt-5 flex justify-end">
                <ArrowRight className="h-5 w-5 text-[#313B31]" />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function MarketSummary() {
  return (
    <Card>
      <h3 className="text-xl font-semibold text-[#1F2B1F]">Market Summary</h3>

      <div className="mt-5 space-y-4">
        {marketRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-2xl border border-[#EEF2EC] px-4 py-4"
          >
            <span className="text-[15px] text-[#5F695D]">{row.label}</span>
            <span className="text-[16px] font-semibold text-[#1F2B1F]">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Timeline() {
  return (
    <Card>
      <h3 className="text-xl font-semibold text-[#1F2B1F]">Your Farm Timeline</h3>

      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="relative mb-6 flex items-center justify-between px-8">
            <div className="absolute left-10 right-10 top-1/2 h-[3px] -translate-y-1/2 bg-[#DDE6D9]" />
            {timelineSteps.map((step) => (
              <div
                key={step.label}
                className={`relative z-10 h-8 w-8 rounded-full border-4 ${
                  step.done ? "border-[#2F8F46] bg-white" : "border-[#D6DDD2] bg-white"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {timelineSteps.map((step) => (
              <div key={step.label}>
                <p
                  className={`text-[16px] font-semibold ${
                    step.current ? "text-[#2F8F46]" : "text-[#1F2B1F]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-2 text-sm text-[#657064]">{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function RecentAlerts() {
  // Same three alerts the Alerts page shows, from the same endpoint, so the two
  // screens cannot disagree about what is urgent.
  const { data, loading, error } = useApiData("/farmer/alerts", {
    adapt: adaptAlerts,
    fallback: sampleAlerts,
  });
  const recent = (data || []).slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#1F2B1F]">Recent Alerts</h3>
        <Link to="/alerts" className="text-sm font-semibold text-[#2F8F46] hover:text-[#256D36]">
          View all
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {recent.map((alert) => {
          const severity = SEVERITIES[alert.severity];
          return (
            <Link
              key={alert.id}
              to="/alerts"
              className="block rounded-2xl border border-[#EEF2EC] px-4 py-3.5 transition hover:bg-[#FAFCF9]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: severity.surface, color: severity.tone }}
                >
                  {severity.label}
                </span>
                <span className="text-[11px] text-[#A0AA9E]">{formatAlertAge(alert.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-[#263026]">
                {alert.title}
              </p>
            </Link>
          );
        })}

        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#EEF2EC] px-4 py-5 text-center text-sm text-[#667164]">
            {loading ? "Checking for alerts..." : error || "No alerts right now."}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function MobileDashboardContent() {
  const overview = useFarmOverview();

  return (
    <>
      <TodayHero compact />

      <MobileCard>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF5EA]">
            <Sprout className="h-8 w-8 text-[#2F8F46]" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1C251D]">{overview.cropName}</h3>
            <div className="mt-2 inline-flex rounded-full bg-[#EAF4E6] px-3 py-1 text-xs font-medium text-[#2F6B33]">
              {overview.stage}
            </div>

            <div className="mt-4">
              <p className="text-sm text-[#6B7468]">Harvest in</p>
              <p className="text-[32px] font-bold leading-none text-[#111711]">
                {overview.harvestIn || "Not recorded"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E6ECE3]">
            <div
              className="h-full rounded-full bg-[#2F8F46]"
              style={{ width: `${overview.progress ?? 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-[#324032]">
            {overview.progress == null ? "--" : `${overview.progress}%`}
          </span>
        </div>
      </MobileCard>

      <MobileCard className="border-[#DDEBDD]">
        <div className="inline-flex rounded-full bg-[#EDF7ED] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2F7C33]">
          {recommendation.label}
        </div>
        <h2 className="mt-3 text-[25px] font-bold leading-tight text-[#111711]">
          Wait 10 days
          <br />
          before selling
        </h2>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Link
            to="/sell-smart"
            className="rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white"
          >
            View Analysis
          </Link>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF7ED]">
            <TrendingUp className="h-7 w-7 text-[#2F8F46]" />
          </div>
        </div>
      </MobileCard>

      <MobileCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#6B7468]">Price Today</p>
            <div className="mt-2 text-[28px] font-bold leading-none text-[#111711]">
              KES 80<span className="text-base font-medium">/kg</span>
            </div>
          </div>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#EEF7E8] px-3 py-1 text-xs font-semibold text-[#2F8F46]">
            <TrendingUp className="h-3.5 w-3.5" />
            {priceToday.trend}
          </div>
        </div>

        <SimpleBars />

        <p className="mt-2 text-sm text-[#2F8F46]">{priceToday.change}</p>
      </MobileCard>

      <div className="rounded-[18px] border border-[#DCE7F1] bg-white p-3.5 shadow-[0_2px_10px_rgba(24,33,24,0.04)]">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF5FC]">
            <CloudRain className="h-6 w-6 text-[#5383C5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4573B5]">Weather Alert</p>
            <h3 className="mt-1 text-base font-bold text-[#1A2225]">Rain expected tomorrow</h3>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2.5 text-lg font-semibold text-[#1F2B1F]">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className="rounded-[18px] border border-[#E8ECE5] bg-white p-3 text-center shadow-[0_2px_10px_rgba(24,33,24,0.04)]"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1F6EE]">
                  <Icon className="h-5 w-5 text-[#2F8F46]" />
                </div>
                <p className="mt-2 text-[12px] font-semibold leading-4 text-[#1B241D]">
                  {item.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function DashboardModule() {
  return (
    <>
      <DesktopDashboardShell>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <TodayHero />
          </div>

          <div className="col-span-12 xl:col-span-3">
            <FarmOverviewCard />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <RecommendationCard />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <PriceTodayCard />
          </div>

          <div className="col-span-12">
            <WeatherStrip />
          </div>

          <div className="col-span-12 xl:col-span-8">
            <QuickActions />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <MarketSummary />
          </div>

          <div className="col-span-12 xl:col-span-8">
            <Timeline />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <RecentAlerts />
          </div>
        </div>
      </DesktopDashboardShell>

      <DashboardMobileShell>
        <MobileDashboardContent />
      </DashboardMobileShell>
    </>
  );
}
