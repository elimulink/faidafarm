import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import {
  AppShell,
  Card,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import TempRangeChart from "../../components/charts/TempRangeChart";
import {
  current,
  daily,
  dayLabel,
  getFarmAdvisories,
  getHeadlineAdvice,
  hourly,
  place,
  rainfallTotalMm,
} from "../../data/weatherData";

const CONDITION_ICONS = {
  "Heavy rain": CloudRain,
  Rain: CloudRain,
  "Light rain": CloudRain,
  Showers: CloudRain,
  Cloudy: Cloud,
  Clear: Sun,
  Sunny: Sun,
};

// A component rather than a lookup assigned to a capitalised variable in a
// render body, which the React compiler lint rightly flags.
function ConditionIcon({ condition, className = "" }) {
  const Icon = CONDITION_ICONS[condition] || CloudSun;
  return <Icon className={className} />;
}

const STATUS = {
  good: { icon: CheckCircle2, tone: "#2F8F46", surface: "#F1F6EE", border: "#DCEAD5" },
  watch: { icon: Eye, tone: "#B77A18", surface: "#FDF8EE", border: "#F2E2C4" },
  avoid: { icon: AlertTriangle, tone: "#C2542F", surface: "#FBEEE9", border: "#F2D6CB" },
};

function CurrentConditions({ compact = false }) {
  return (
    <div className="rounded-[26px] border border-[#DCE7F1] bg-gradient-to-b from-[#F3F7FC] to-[#FAFCFE] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#4573B5]">
            {place.name}, {place.county}
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className={`font-bold leading-none text-[#1A2225] ${compact ? "text-[52px]" : "text-[64px]"}`}>
              {current.tempC}&deg;
            </span>
            <span className="pb-2 text-lg font-semibold text-[#61707B]">{current.condition}</span>
          </div>
          <p className="mt-1.5 text-sm text-[#61707B]">
            Feels like {current.feelsLikeC}&deg; · {current.windDir} wind {current.windKph} km/h
          </p>
        </div>
        <ConditionIcon
          condition={current.condition}
          className={`shrink-0 text-[#5383C5] ${compact ? "h-14 w-14" : "h-20 w-20"}`}
        />
      </div>

      <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium leading-6 text-[#2C4A6B]">
        {getHeadlineAdvice()}
      </p>
    </div>
  );
}

function HourlyStrip() {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div className="flex gap-2">
        {hourly.map((hour, index) => {
          return (
            <div
              key={index}
              className="flex w-[68px] shrink-0 flex-col items-center rounded-2xl bg-[#F7F9FB] px-2 py-3"
            >
              <span className="text-[11px] font-semibold text-[#8A958A]">
                {index === 0
                  ? "Now"
                  : hour.at.toLocaleTimeString([], { hour: "numeric", hour12: true })}
              </span>
              <ConditionIcon condition={hour.condition} className="my-2 h-6 w-6 text-[#5383C5]" />
              <span className="text-sm font-bold text-[#182118]">{hour.temp}&deg;</span>
              <span className="mt-0.5 text-[11px] font-semibold text-[#4573B5]">{hour.rain}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyRows() {
  const maxRain = Math.max(...daily.map((day) => day.rainfallMm), 1);

  return (
    <ul className="divide-y divide-[#F0F3EE]">
      {daily.map((day, index) => (
        <li
          key={index}
          className="grid grid-cols-[minmax(58px,auto)_20px_1fr_auto] items-center gap-x-3 py-3 sm:grid-cols-[76px_20px_96px_1fr_auto]"
        >
          <span className="text-sm font-semibold text-[#182118]">{dayLabel(day.date, index)}</span>

          <ConditionIcon condition={day.condition} className="h-5 w-5 text-[#5383C5]" />

          {/* The icon already carries this on a narrow screen. */}
          <span className="hidden truncate text-sm text-[#667164] sm:block">{day.condition}</span>

          <span className="flex min-w-0 items-center gap-2">
            <span className="h-2 min-w-[24px] flex-1 overflow-hidden rounded-full bg-[#EEF3F8]">
              <span
                className="block h-full rounded-full bg-[#5383C5]"
                style={{ width: `${(day.rainfallMm / maxRain) * 100}%` }}
              />
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-[#4573B5]">
              {day.rainfallMm} mm
            </span>
          </span>

          {/* whitespace-nowrap plus auto width: this column used to be a fixed
              62px and clipped "25 / 17" on a 360px screen. */}
          <span className="shrink-0 whitespace-nowrap text-right text-sm">
            <span className="font-bold text-[#C2542F]">{day.high}&deg;</span>
            <span className="text-[#8A958A]">/{day.low}&deg;</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function AdvisoryCard({ item }) {
  const style = STATUS[item.status] || STATUS.watch;
  const Icon = style.icon;

  return (
    <div
      className="rounded-[22px] border p-4"
      style={{ background: style.surface, borderColor: style.border }}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: style.tone }} />
        <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: style.tone }}>
          {item.title}
        </span>
      </div>
      <p className="mt-1.5 text-[16px] font-bold text-[#182118]">{item.verdict}</p>
      <p className="mt-1 text-sm leading-6 text-[#4C574D]">{item.detail}</p>
    </div>
  );
}

function ConditionTiles() {
  const tiles = [
    { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
    { icon: Wind, label: "Wind", value: `${current.windKph} km/h ${current.windDir}` },
    { icon: CloudRain, label: "Rain, 7 days", value: `${rainfallTotalMm} mm` },
    { icon: Sunrise, label: "Sunrise", value: current.sunrise },
    { icon: Sunset, label: "Sunset", value: current.sunset },
    { icon: Sun, label: "Chance of rain", value: `${current.rainChance}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div key={tile.label} className="border-t border-[#F0F3EE] pt-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">
              <Icon size={13} />
              {tile.label}
            </span>
            <p className="mt-1.5 text-lg font-bold text-[#182118]">{tile.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function SampleNote() {
  return (
    <p className="mt-4 text-[11px] text-[#A0AA9E]">
      Sample forecast. A live weather feed arrives with the backend.
    </p>
  );
}

function DesktopContent() {
  const advisories = getFarmAdvisories();

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <CurrentConditions />

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-[#8A958A]">
            Next 12 hours
          </h3>
          <div className="mt-3">
            <HourlyStrip />
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-[#8A958A]">
            Next 7 days
          </h3>
          <div className="mt-3">
            <TempRangeChart days={daily} labelFor={(day, index) => dayLabel(day.date, index)} height={186} />
          </div>
          <div className="mt-3">
            <DailyRows />
          </div>
          <SampleNote />
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>What this means for your farm</SectionTitle>
          <div className="mt-4 space-y-3">
            {advisories.map((item) => (
              <AdvisoryCard key={item.id} item={item} />
            ))}
          </div>
        </Card>

        <div className="mt-6">
          <Card>
            <SectionTitle>Conditions</SectionTitle>
            <div className="mt-4">
              <ConditionTiles />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MobileSection({ title, children }) {
  return (
    <section className="pt-7 first:pt-2">
      {title ? (
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8A958A]">{title}</h3>
      ) : null}
      {children}
    </section>
  );
}

function MobileContent() {
  const advisories = getFarmAdvisories();

  // Deliberately not wrapped in MobileCard: that component is itself a bordered
  // card, so nesting the tinted panels inside it drew a box within a box. Plain
  // sections with generous spacing read better and leave the page open.
  return (
    <div className="pb-8">
      <MobileSection>
        <CurrentConditions compact />
      </MobileSection>

      <MobileSection title="Next 12 hours">
        <HourlyStrip />
      </MobileSection>

      <MobileSection title="Next 7 days">
        <TempRangeChart days={daily} labelFor={(day, index) => dayLabel(day.date, index)} />
        <div className="mt-2 border-t border-[#F0F3EE]">
          <DailyRows />
        </div>
      </MobileSection>

      <MobileSection title="What this means for your farm">
        <div className="space-y-3">
          {advisories.map((item) => (
            <AdvisoryCard key={item.id} item={item} />
          ))}
        </div>
      </MobileSection>

      <MobileSection title="Conditions">
        <ConditionTiles />
        <SampleNote />
      </MobileSection>
    </div>
  );
}

export default function WeatherModule() {
  return (
    <AppShell
      current="weather"
      title="Weather"
      subtitle={`${place.name}, Kenya`}
      mobileSubtitle={place.name}
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
