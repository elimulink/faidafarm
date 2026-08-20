import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCheck,
  CloudRain,
  Info,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import {
  SEVERITIES,
  alerts as sampleAlerts,
  formatAlertAge,
  loadReadAlerts,
  saveReadAlerts,
} from "../../data/alertsData";
import { adaptAlerts } from "../../data/adapters";
import { useApiData } from "../../lib/useApiData";

const CATEGORY_ICONS = {
  Weather: CloudRain,
  Price: TrendingUp,
  Buyers: Users,
  Crop: Sprout,
};

const SEVERITY_ICONS = {
  urgent: AlertTriangle,
  attention: Bell,
  info: Info,
};

// Most urgent first, then newest, so the top of the list is always the thing
// that matters most today.
const SEVERITY_ORDER = { urgent: 0, attention: 1, info: 2 };

function useAlerts() {
  const [readIds, setReadIds] = useState(() => loadReadAlerts());
  const [filter, setFilter] = useState("all");

  // No fallback on error: a stale sample alert telling a farmer to cover produce
  // for rain that is not coming is worse than showing nothing.
  const { data, live, loading, error } = useApiData("/farmer/alerts", {
    adapt: adaptAlerts,
    fallback: sampleAlerts,
  });

  const sorted = useMemo(
    () =>
      [...(data || [])].sort(
        (a, b) =>
          SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.createdAt - a.createdAt
      ),
    [data]
  );

  const visible = useMemo(() => {
    if (filter === "all") {
      return sorted;
    }
    if (filter === "unread") {
      return sorted.filter((alert) => !readIds.includes(alert.id));
    }
    return sorted.filter((alert) => alert.category === filter);
  }, [filter, readIds, sorted]);

  const unreadCount = sorted.filter((alert) => !readIds.includes(alert.id)).length;

  const markRead = (id) => {
    setReadIds((current) => {
      if (current.includes(id)) {
        return current;
      }
      const next = [...current, id];
      saveReadAlerts(next);
      return next;
    });
  };

  const markAllRead = () => {
    const next = sorted.map((alert) => alert.id);
    setReadIds(next);
    saveReadAlerts(next);
  };

  return { filter, setFilter, visible, readIds, unreadCount, markRead, markAllRead, total: sorted.length, live, loading, error };
}

function FilterChips({ value, onChange, unreadCount }) {
  const options = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
    { id: "Weather", label: "Weather" },
    { id: "Price", label: "Price" },
    { id: "Buyers", label: "Buyers" },
    { id: "Crop", label: "Crop" },
  ];

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

function AlertCard({ alert, read, onRead }) {
  const severity = SEVERITIES[alert.severity];
  const CategoryIcon = CATEGORY_ICONS[alert.category] || Bell;
  const SeverityIcon = SEVERITY_ICONS[alert.severity] || Info;

  return (
    <article
      className={`rounded-[24px] border p-4 transition ${
        read ? "border-[#EEF2EC] bg-white" : "border-[#E4EAE1] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: severity.surface, color: severity.tone }}
        >
          <CategoryIcon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status is never colour alone: icon plus label. */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
              style={{ background: severity.surface, color: severity.tone }}
            >
              <SeverityIcon size={11} />
              {severity.label}
            </span>
            <span className="text-[11px] font-semibold text-[#8A958A]">{alert.category}</span>
            <span className="text-[11px] text-[#A0AA9E]">{formatAlertAge(alert.createdAt)}</span>
            {!read ? (
              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#2F8F46]" aria-label="Unread" />
            ) : null}
          </div>

          <h4 className={`mt-1.5 text-[16px] leading-snug ${read ? "font-semibold" : "font-bold"} text-[#182118]`}>
            {alert.title}
          </h4>
          <p className="mt-1.5 text-sm leading-6 text-[#4C574D]">{alert.detail}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              to={alert.action.to}
              onClick={() => onRead(alert.id)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#166534] px-3.5 py-2 text-xs font-semibold text-white"
            >
              {alert.action.label}
              <ArrowRight size={13} />
            </Link>
            {!read ? (
              <button
                type="button"
                onClick={() => onRead(alert.id)}
                className="rounded-2xl border border-[#E4EAE1] px-3.5 py-2 text-xs font-semibold text-[#4C574D] transition hover:bg-[#F5F8F3]"
              >
                Mark read
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function AlertsList({ compact = false }) {
  const state = useAlerts();

  const list = state.visible.length ? (
    <div className="space-y-3">
      {state.visible.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          read={state.readIds.includes(alert.id)}
          onRead={state.markRead}
        />
      ))}
    </div>
  ) : (
    <div className="rounded-[24px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-6 py-10 text-center">
      <CheckCheck className="mx-auto h-7 w-7 text-[#2F8F46]" />
      <p className="mt-2 text-sm font-semibold text-[#182118]">
        {state.loading ? "Checking for alerts" : state.error ? "Alerts unavailable" : "Nothing here"}
      </p>
      <p className="mt-1 text-sm text-[#667164]">
        {state.loading
          ? "One moment."
          : state.error
            ? state.error
            : state.filter === "unread"
              ? "You are up to date."
              : "No alerts in this category."}
      </p>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-[#667164]">
        {state.unreadCount
          ? `${state.unreadCount} unread of ${state.total}`
          : `All ${state.total} read`}
      </p>
      {state.unreadCount ? (
        <button
          type="button"
          onClick={state.markAllRead}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534]"
        >
          <CheckCheck size={14} />
          Mark all read
        </button>
      ) : null}
    </div>
  );

  if (compact) {
    return (
      <div className="space-y-4">
        <MobileCard>
          {header}
          <div className="mt-3">
            <FilterChips value={state.filter} onChange={state.setFilter} unreadCount={state.unreadCount} />
          </div>
        </MobileCard>
        {list}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle
            action={
              state.unreadCount ? (
                <button
                  type="button"
                  onClick={state.markAllRead}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534]"
                >
                  <CheckCheck size={15} />
                  Mark all read
                </button>
              ) : null
            }
          >
            What needs your attention
          </SectionTitle>
          <p className="mt-1 text-sm text-[#667164]">
            {state.unreadCount
              ? `${state.unreadCount} unread of ${state.total}, most urgent first.`
              : `All ${state.total} read, most urgent first.`}
          </p>

          <div className="mt-4">
            <FilterChips value={state.filter} onChange={state.setFilter} unreadCount={state.unreadCount} />
          </div>

          <div className="mt-5">{list}</div>
        </Card>
      </div>
    </div>
  );
}

export default function AlertsModule() {
  return (
    <AppShell
      current="alerts"
      title="Alerts"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Kitui"
      desktopContent={<AlertsList />}
      mobileContent={<AlertsList compact />}
    />
  );
}
