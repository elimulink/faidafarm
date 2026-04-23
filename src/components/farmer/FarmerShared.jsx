import React from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  CloudRain,
  Handshake,
  HelpCircle,
  Home,
  LineChart,
  MapPin,
  Menu,
  Settings,
  Sprout,
  Tractor,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export const sidebarItems = [
  { label: "Dashboard", icon: Home, key: "dashboard", path: "/dashboard" },
  { label: "My Farm", icon: Sprout, key: "my-farm", path: "/my-farm" },
  {
    label: "Market Intelligence",
    icon: LineChart,
    key: "market-intelligence",
    path: "/market-intelligence",
  },
  { label: "Sell Smart", icon: Handshake, key: "sell-smart", path: "/sell-smart" },
  { label: "Buyers", icon: User, key: "buyers", path: "/buyers" },
  { label: "Weather", icon: CloudRain, key: "weather", path: "/weather" },
  { label: "Alerts", icon: Bell, key: "alerts", path: "/alerts" },
  {
    label: "Tools & Services",
    icon: Wrench,
    key: "tools-services",
    path: "/tools-services",
  },
  { label: "Financing", icon: Wallet, key: "financing", path: "/financing" },
  { label: "Settings", icon: Settings, key: "settings", path: "/settings" },
  { label: "Help & Support", icon: HelpCircle, key: "help-support", path: "/help" },
];

const mobileNavItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "My Farm", icon: Sprout, path: "/my-farm" },
  { label: "Market", icon: LineChart, path: "/market-intelligence" },
  { label: "Buyers", icon: User, path: "/buyers" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
];

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BrandLogo({ className = "h-12 w-12" }) {
  return <img src="/logo.png" alt="FaidaFarm logo" className={`${className} object-contain`} />;
}

export function AppShell({
  current = "dashboard",
  title = "Dashboard",
  subtitle = "Kitui, Kenya",
  mobileSubtitle = "Module",
  desktopContent,
  mobileContent,
}) {
  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <DesktopShell current={current} title={title} subtitle={subtitle}>
        {desktopContent}
      </DesktopShell>
      <MobileShell current={current} title={title} subtitle={mobileSubtitle}>
        {mobileContent}
      </MobileShell>
    </div>
  );
}

export function DesktopShell({ current, title, subtitle, children }) {
  return (
    <div className="hidden min-h-screen bg-[#F6F8F4] lg:flex">
      <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#E7ECE5] bg-[#FBFCF9]">
        <div className="px-6 py-7">
          <Link to="/dashboard" className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12" />
            <div>
              <h1 className="text-[28px] font-bold leading-none text-[#1F2B1F]">
                FaidaFarm
              </h1>
              <p className="mt-1 text-xs text-[#6B7468]">Farm smarter. Earn more.</p>
            </div>
          </Link>
        </div>

        <nav className="px-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === current;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                    isActive
                      ? "bg-[#145A32] text-white shadow-sm"
                      : "text-[#354235] hover:bg-[#F1F5EE]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[15px] font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-3xl border border-[#E4EBDD] bg-[#EEF5EA]">
            <div className="p-4">
              <h3 className="text-[18px] font-semibold text-[#223022]">Upgrade your farming</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F695D]">
                Get the right tools and financing to grow more.
              </p>
              <button className="mt-4 rounded-xl bg-[#DCEAD5] px-4 py-2.5 text-sm font-semibold text-[#20562B] hover:bg-[#D2E4CA]">
                Explore Now
              </button>
            </div>
            <div className="flex items-end justify-end px-4 pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DCEAD5]">
                <Tractor className="h-10 w-10 text-[#2E7D32]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E7ECE5] bg-white px-8 py-5">
          <div>
            <h2 className="text-[34px] font-bold leading-tight text-[#1E2720]">{title}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7468]">
              <MapPin className="h-4 w-4" />
              <span>{subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="relative rounded-full p-2 transition hover:bg-[#F4F7F2]"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6 text-[#2B342C]" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="h-10 w-px bg-[#E5EBE2]" />

            <button type="button" className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-[#F6F8F5]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDECD8] text-[#1E5D31]">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1F2B1F]">Victor M.</p>
                <p className="text-xs text-[#6B7468]">Smallholder Farmer</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#697368]" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export function DashboardHeader() {
  return (
    <header className="hidden items-center justify-between border-b border-[#E7ECE5] bg-white px-8 py-5 lg:flex">
      <div>
        <h2 className="text-[34px] font-bold leading-tight text-[#1E2720]">
          Good afternoon, Victor <span className="text-[28px]">☀️</span>
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7468]">
          <MapPin className="h-4 w-4" />
          <span>Kitui, Kenya</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          className="relative rounded-full p-2 transition hover:bg-[#F4F7F2]"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6 text-[#2B342C]" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="h-10 w-px bg-[#E5EBE2]" />

        <button type="button" className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-[#F6F8F5]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDECD8] text-[#1E5D31]">
            <User className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#1F2B1F]">Victor M.</p>
            <p className="text-xs text-[#6B7468]">Smallholder Farmer</p>
          </div>
          <ChevronDown className="h-4 w-4 text-[#697368]" />
        </button>
      </div>
    </header>
  );
}

export function DesktopDashboardShell({ children }) {
  return (
    <div className="hidden min-h-screen bg-[#F6F8F4] lg:flex">
      <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#E7ECE5] bg-[#FBFCF9]">
        <div className="px-6 py-7">
          <Link to="/dashboard" className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12" />
            <div>
              <h1 className="text-[28px] font-bold leading-none text-[#1F2B1F]">
                FaidaFarm
              </h1>
              <p className="mt-1 text-xs text-[#6B7468]">Farm smarter. Earn more.</p>
            </div>
          </Link>
        </div>

        <nav className="px-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                    item.key === "dashboard"
                      ? "bg-[#145A32] text-white shadow-sm"
                      : "text-[#354235] hover:bg-[#F1F5EE]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[15px] font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-3xl border border-[#E4EBDD] bg-[#EEF5EA]">
            <div className="p-4">
              <h3 className="text-[18px] font-semibold text-[#223022]">Upgrade your farming</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F695D]">
                Get the right tools and financing to grow more.
              </p>
              <button className="mt-4 rounded-xl bg-[#DCEAD5] px-4 py-2.5 text-sm font-semibold text-[#20562B] hover:bg-[#D2E4CA]">
                Explore Now
              </button>
            </div>
            <div className="flex items-end justify-end px-4 pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DCEAD5]">
                <Tractor className="h-10 w-10 text-[#2E7D32]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export function MobileShell({ current, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#F6F8F4] pb-24 lg:hidden">
      <div className="rounded-b-[28px] bg-[#145A32] px-4 pb-5 pt-4 text-white">
        <div className="flex items-center justify-between">
          <button type="button" className="rounded-xl p-2 hover:bg-white/10" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>

          <div className="text-center">
            <p className="text-sm opacity-90">{subtitle}</p>
            <h2 className="text-[24px] font-bold leading-none">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-xl p-2 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">{children}</div>
      <MobileBottomNav current={current} />
    </div>
  );
}

export function DashboardMobileShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F8F4] pb-24 lg:hidden">
      <div className="rounded-b-[28px] bg-[#145A32] px-4 pb-5 pt-4 text-white">
        <div className="flex items-center justify-between">
          <button type="button" className="rounded-xl p-2 hover:bg-white/10" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>

          <div className="text-center">
            <p className="text-sm opacity-90">Good afternoon,</p>
            <h2 className="text-[28px] font-bold leading-none">Victor</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-xl p-2 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">{children}</div>
      <MobileBottomNav current="dashboard" />
    </div>
  );
}

export function MobileBottomNav({ current }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5ECE2] bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === "/dashboard" ? current === "dashboard" : item.path.includes(current);
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2"
            >
              <Icon className={cn("h-5 w-5", active ? "text-[#1C6B34]" : "text-[#7A8377]")} />
              <span
                className={cn(
                  "text-[11px]",
                  active ? "font-semibold text-[#1C6B34]" : "text-[#7A8377]"
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[#E7ECE5] bg-white p-6 shadow-[0_2px_12px_rgba(25,40,20,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MobileCard({ children, className = "" }) {
  return (
    <div className={cn("rounded-[24px] border border-[#E7ECE5] bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h3 className="text-2xl font-semibold text-[#1F2B1F]">{children}</h3>
      {action ? (
        <button type="button" className="text-sm font-semibold text-[#2F8F46]">
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function SimpleBars() {
  return (
    <div className="mt-6 flex h-[92px] items-end gap-2">
      {[24, 34, 27, 40, 35, 48, 60].map((value, index) => (
        <div key={index} className="flex-1">
          <div className="w-full rounded-t-xl bg-[#CFE6C7]" style={{ height: `${value}px` }} />
        </div>
      ))}
    </div>
  );
}

export function ActionButton({ children, to = "#" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14582D]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
