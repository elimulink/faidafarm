import React from "react";
import {
  Bell,
  ChevronDown,
  CloudRain,
  LogOut,
  Handshake,
  Home,
  LineChart,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Repeat2,
  Settings,
  Sprout,
  Tractor,
  User,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../../auth/session";

const sidebarItems = [
  { label: "Dashboard", icon: Home, key: "dashboard", path: "/dashboard" },
  { label: "My Farm", icon: Sprout, key: "my-farm", path: "/my-farm" },
  {
    label: "Market Intelligence",
    icon: LineChart,
    key: "market-intelligence",
    path: "/market-intelligence",
  },
  { label: "Sell Smart", icon: Handshake, key: "sell-smart", path: "/sell-smart" },
  { label: "Find Buyers", icon: Users, key: "find-buyers", path: "/find-buyers" },
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
];

const mobileNavItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "My Farm", icon: Sprout, path: "/my-farm" },
  { label: "Market", icon: LineChart, path: "/market-intelligence" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BrandLogo({ className = "h-12 w-12" }) {
  return <img src="/logo.png" alt="FaidaFarm logo" className={`${className} object-contain`} />;
}

function MobileBrandBar({ onMenuClick }) {
  return (
    <div className="sticky top-0 z-40 border-b border-[#DDEBDD] bg-white/96 px-4 py-2.5 text-[#162016] backdrop-blur">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#CFE8D3] bg-[#ECF8EE]">
            <BrandLogo className="h-5 w-5" />
          </span>
          <div className="leading-none">
            <p className="text-[15px] font-bold tracking-tight text-[#152316]">FaidaFarm</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#16833C]">Farmer</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CFE8D3] bg-[#ECF8EE] text-[#203320] shadow-[0_3px_12px_rgba(24,33,24,0.08)] hover:bg-[#E3F2E5]"
          aria-label="Menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}

function WorkspaceActions({ mobile = false, drawer = false }) {
  const navigate = useNavigate();

  return (
    <div className={cn("flex gap-2", drawer ? "flex-col" : "items-center", mobile ? "gap-1.5" : "gap-2")}>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl font-medium transition",
          drawer
            ? "w-full rounded-xl bg-[#F1F5EE] px-3 py-2.5 text-sm text-[#20562B] hover:bg-[#E8F0E3]"
            : mobile
              ? "bg-white/15 px-3 py-2 text-[11px] text-white hover:bg-white/20"
              : "border border-[#D7DED4] bg-white px-3 py-1.5 text-xs text-[#20562B] hover:bg-[#EEF5EA]"
        )}
      >
        <Repeat2 className="h-4 w-4" />
        <span>Change View</span>
      </button>

      <button
        type="button"
        onClick={() => {
          clearStoredUser();
          navigate("/login");
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl font-medium transition",
          drawer
            ? "w-full rounded-xl px-3 py-2.5 text-sm text-[#9F2F20] hover:bg-[#FFF7F6]"
            : mobile
              ? "bg-white/15 px-3 py-2 text-[11px] text-white hover:bg-white/20"
              : "border border-[#F1D6D3] bg-white px-3 py-1.5 text-xs text-[#9F2F20] hover:bg-[#FDECEC]"
        )}
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}

function DesktopProfileMenu({ workspace = "Farmer" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-[#DDEBDD] bg-white px-2 py-1 text-xs font-medium text-[#354235] shadow-sm hover:bg-[#F6F8F5]"
        aria-label="Open account menu"
        aria-expanded={isOpen}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#101810] text-white">
          <User className="h-3.5 w-3.5" />
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#697368]" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-10 z-50 w-72 overflow-hidden rounded-xl border border-[#DDEBDD] bg-white text-sm shadow-[0_16px_40px_rgba(24,33,24,0.14)]">
          <div className="border-b border-[#E7ECE5] px-4 py-3">
            <p className="truncate text-sm font-medium text-[#1F2B1F]">Victor M.</p>
            <p className="mt-1 text-xs text-[#6B7468]">{workspace} workspace</p>
          </div>
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-[#354235] hover:bg-[#F6F8F5]"
            >
              <Settings className="h-4 w-4" />
              Account preferences
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-[#354235] hover:bg-[#F6F8F5]"
            >
              <Repeat2 className="h-4 w-4" />
              Change View
            </button>
          </div>
          <div className="border-t border-[#E7ECE5] py-1">
            <button
              type="button"
              onClick={() => {
                clearStoredUser();
                setIsOpen(false);
                navigate("/login");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-[#9F2F20] hover:bg-[#FFF7F6]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FarmerMobileMenu({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close farmer menu overlay"
        className="absolute inset-0 bg-[#101810]/30"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E7ECE5] px-4 pb-3 pt-5">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <BrandLogo className="h-7 w-7" />
            <div>
              <p className="text-base font-bold tracking-tight text-[#1F2B1F]">FaidaFarm</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1C6B34]">Menu</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#5F695D] hover:bg-[#F1F5EE]"
            aria-label="Close menu"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition",
                      isActive
                        ? "bg-[#F1F5EE] text-[#145A32]"
                        : "text-[#354235] hover:bg-[#F6F8F4]"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#E7ECE5] px-4 pb-4 pt-2.5">
          <WorkspaceActions drawer />
        </div>
      </aside>
    </div>
  );
}

export function AppShell({
  current = "dashboard",
  title = "Dashboard",
  subtitle = "Kitui, Kenya",
  mobileSubtitle = "",
  desktopContent,
  mobileContent,
}) {
  return (
    <div className="min-h-screen bg-white">
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
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="hidden min-h-screen bg-[#F6F8F4] lg:flex">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-[#E7ECE5] bg-[#FBFCF9] transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-[250px]"
        )}
      >
        <div className={cn("flex items-start py-7", collapsed ? "flex-col items-center gap-2 px-3" : "justify-between gap-3 px-6")}>
          <Link
            to="/dashboard"
            title={collapsed ? "FaidaFarm" : undefined}
            className={cn("rounded-2xl hover:bg-[#F1F5EE]", collapsed ? "p-2" : "flex items-center gap-3")}
          >
            <BrandLogo className={collapsed ? "h-9 w-9" : "h-12 w-12"} />
            {!collapsed ? (
              <div>
                <h1 className="text-[24px] font-bold leading-none text-[#1F2B1F]">
                  FaidaFarm
                </h1>
                <p className="mt-1 text-xs text-[#6B7468]">Farm smarter. Earn more.</p>
              </div>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-xl p-2 text-[#5F695D] hover:bg-[#F1F5EE] hover:text-[#1F2B1F]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className={collapsed ? "px-3" : "px-4"}>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === current;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center rounded-2xl py-3 text-left transition",
                    collapsed ? "justify-center px-0" : "gap-3 px-4",
                    isActive
                      ? "bg-[#145A32] text-white shadow-sm"
                      : "text-[#354235] hover:bg-[#F1F5EE]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed ? <span className="text-[15px] font-medium">{item.label}</span> : null}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {!collapsed ? <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-3xl border border-[#E4EBDD] bg-[#EEF5EA]">
            <div className="p-4">
              <h3 className="text-base font-semibold text-[#223022]">Upgrade your farming</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F695D]">
                Get the right tools and financing to grow more.
              </p>
              <button className="mt-4 rounded-xl bg-[#DCEAD5] px-4 py-2.5 text-sm font-medium text-[#20562B] hover:bg-[#D2E4CA]">
                Explore Now
              </button>
            </div>
            <div className="flex items-end justify-end px-4 pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DCEAD5]">
                <Tractor className="h-10 w-10 text-[#2E7D32]" />
              </div>
            </div>
          </div>
        </div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#DDEBDD] bg-white/95 px-5 py-2 backdrop-blur">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo className="h-7 w-7" />
              <h2 className="text-[15px] font-bold leading-tight text-[#1E2720]">{title}</h2>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7468]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full px-3 py-1.5 text-xs font-medium text-[#5F695D] hover:bg-[#F6F8F5]">
              Feedback
            </button>

            <button
              type="button"
              className="relative rounded-full border border-[#DDEBDD] bg-white p-2 transition hover:bg-[#F4F7F2]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-[#2B342C]" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <DesktopProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export function DashboardHeader() {
  return (
    <header className="hidden items-center justify-between border-b border-[#DDEBDD] bg-white/95 px-5 py-2 backdrop-blur lg:flex">
      <div>
        <h2 className="text-[28px] font-bold leading-tight text-[#1E2720]">
          Good afternoon, Victor <span className="text-[22px]">☀️</span>
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7468]">
          <MapPin className="h-4 w-4" />
          <span>Kitui, Kenya</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-full px-3 py-1.5 text-xs font-medium text-[#5F695D] hover:bg-[#F6F8F5]">
          Feedback
        </button>

        <button
          type="button"
          className="relative rounded-full border border-[#DDEBDD] bg-white p-2 transition hover:bg-[#F4F7F2]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-[#2B342C]" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <DesktopProfileMenu />
      </div>
    </header>
  );
}

export function DesktopDashboardShell({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="hidden min-h-screen bg-[#F6F8F4] lg:flex">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-[#E7ECE5] bg-[#FBFCF9] transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-[250px]"
        )}
      >
        <div className={cn("flex items-start py-7", collapsed ? "flex-col items-center gap-2 px-3" : "justify-between gap-3 px-6")}>
          <Link
            to="/dashboard"
            title={collapsed ? "FaidaFarm" : undefined}
            className={cn("rounded-2xl hover:bg-[#F1F5EE]", collapsed ? "p-2" : "flex items-center gap-3")}
          >
            <BrandLogo className={collapsed ? "h-9 w-9" : "h-12 w-12"} />
            {!collapsed ? (
              <div>
                <h1 className="text-[24px] font-bold leading-none text-[#1F2B1F]">
                  FaidaFarm
                </h1>
                <p className="mt-1 text-xs text-[#6B7468]">Farm smarter. Earn more.</p>
              </div>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-xl p-2 text-[#5F695D] hover:bg-[#F1F5EE] hover:text-[#1F2B1F]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className={collapsed ? "px-3" : "px-4"}>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center rounded-2xl py-3 text-left transition",
                    collapsed ? "justify-center px-0" : "gap-3 px-4",
                    item.key === "dashboard"
                      ? "bg-[#145A32] text-white shadow-sm"
                      : "text-[#354235] hover:bg-[#F1F5EE]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed ? <span className="text-[15px] font-medium">{item.label}</span> : null}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {!collapsed ? <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-3xl border border-[#E4EBDD] bg-[#EEF5EA]">
            <div className="p-4">
              <h3 className="text-base font-semibold text-[#223022]">Upgrade your farming</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F695D]">
                Get the right tools and financing to grow more.
              </p>
              <button className="mt-4 rounded-xl bg-[#DCEAD5] px-4 py-2.5 text-sm font-medium text-[#20562B] hover:bg-[#D2E4CA]">
                Explore Now
              </button>
            </div>
            <div className="flex items-end justify-end px-4 pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DCEAD5]">
                <Tractor className="h-10 w-10 text-[#2E7D32]" />
              </div>
            </div>
          </div>
        </div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export function MobileShell({ current, title, subtitle, children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white pb-24 lg:hidden">
      <MobileBrandBar onMenuClick={() => setIsMenuOpen(true)} />

      <div className="space-y-3.5 px-4 pt-3">{children}</div>
      <MobileBottomNav current={current} />
      <FarmerMobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

export function DashboardMobileShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white pb-24 lg:hidden">
      <MobileBrandBar onMenuClick={() => setIsMenuOpen(true)} />

      <div className="space-y-3.5 px-4 pt-3">{children}</div>
      <MobileBottomNav current="dashboard" />
      <FarmerMobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

export function MobileBottomNav({ current }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5ECE2] bg-white/96 shadow-[0_-8px_24px_rgba(24,33,24,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-1.5">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === "/dashboard" ? current === "dashboard" : item.path.includes(current);
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className="flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5"
            >
              <Icon className={cn("h-5 w-5", active ? "text-[#1C6B34]" : "text-[#7A8377]")} />
              <span
                className={cn(
                  "text-[10px]",
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
        "rounded-[24px] border border-[#E7ECE5] bg-white p-5 shadow-[0_2px_12px_rgba(25,40,20,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MobileCard({ children, className = "" }) {
  return (
    <div className={cn("rounded-[18px] border border-[#E7ECE5] bg-white p-3.5 shadow-[0_2px_10px_rgba(24,33,24,0.04)]", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-[#1F2B1F] sm:text-xl">{children}</h3>
      {action ? (
        <button type="button" className="text-sm font-medium text-[#2F8F46]">
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function SimpleBars() {
  return (
    <div className="mt-4 flex h-[72px] items-end gap-2 sm:mt-6 sm:h-[92px]">
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
      className="inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#14582D]"
    >
      {children}
      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
    </Link>
  );
}
