import {
  BarChart3,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  PenLine,
  RefreshCw,
  Repeat2,
  Scale,
  Send,
  Settings,
  Smartphone,
  Utensils,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../../auth/session";
import { canAccessAdminAnalytics, canAccessFieldRoute, canAccessResearchRoute } from "../../auth/access";

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50">
        <img src="/logo.png" alt="FaidaFarm" className="h-5 w-5 object-contain" />
      </span>
      {!compact ? (
        <div className="leading-none">
          <p className="text-[15px] font-bold tracking-tight text-slate-950">FaidaFarm</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">FMNR</p>
        </div>
      ) : null}
    </div>
  );
}

const researchLinks = [
  { label: "Dashboard", path: "/research", icon: LayoutDashboard },
  { label: "Households", path: "/research/households", icon: BarChart3 },
  { label: "FMNR", path: "/research/fmnr-plots", icon: Map },
  { label: "Nutrition", path: "/research/child-nutrition", icon: Utensils },
  { label: "Field", path: "/research/field-activity", icon: BarChart3 },
  { label: "Sync", path: "/research/sync-status", icon: Download },
  { label: "Reports", path: "/research/reports", icon: BarChart3 },
  { label: "Settings", path: "/research/settings", icon: Settings },
];

const adminLinks = [
  { label: "Admin", path: "/research/admin", icon: LayoutDashboard },
  { label: "Map", path: "/research/admin/fmnr-map", icon: Map },
  { label: "Diet", path: "/research/admin/diet-scores", icon: Utensils },
  { label: "County", path: "/research/admin/county", icon: Scale },
  { label: "Exports", path: "/research/admin/exports", icon: Download },
  { label: "Settings", path: "/research/settings", icon: Settings },
];

const fieldLinks = [
  { label: "Field", path: "/research/field", icon: ClipboardList },
  { label: "Library", path: "/research/field/forms", icon: FileText },
  { label: "New", path: "/research/field/forms/new", icon: PenLine },
  { label: "Submissions", path: "/research/field/submissions", icon: Send },
  { label: "Drafts", path: "/research/field/drafts", icon: FileText },
  { label: "Devices", path: "/research/field/devices", icon: Smartphone },
  { label: "Sync Queue", path: "/research/field/sync-queue", icon: RefreshCw },
];

function NavGroup({ title, links, onNavigate, mobileDrawer = false }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className={mobileDrawer ? "space-y-0.5" : "flex gap-2 overflow-x-auto pb-1"}>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 whitespace-nowrap font-medium ${
                  mobileDrawer ? "w-full rounded-xl px-3 py-2 text-[13px]" : "rounded-full px-3 py-2 text-sm"
                } ${
                  isActive ? "bg-slate-100 text-slate-950" : "text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <Icon className={mobileDrawer ? "h-4 w-4" : "h-3.5 w-3.5"} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

function MobileMenuDrawer({
  isOpen,
  onClose,
  navigate,
  visibleResearchLinks,
  visibleFieldLinks,
  visibleAdminLinks,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close menu overlay"
        className="absolute inset-0 bg-slate-950/25"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3 pt-5">
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <nav className="flex-1 divide-y divide-slate-100 overflow-y-auto px-4 py-2">
          <NavGroup title="Research Mode" links={visibleResearchLinks} onNavigate={onClose} mobileDrawer />
          <NavGroup title="Field Collection" links={visibleFieldLinks} onNavigate={onClose} mobileDrawer />
          <NavGroup title="Admin Analytics" links={visibleAdminLinks} onNavigate={onClose} mobileDrawer />
        </nav>

        <div className="space-y-1 border-t border-slate-100 px-4 pb-4 pt-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl bg-slate-100 px-3 py-2 text-[13px] font-medium text-slate-800"
          >
            <Repeat2 className="h-4 w-4" />
            Change View
          </button>
          <button
            type="button"
            onClick={() => {
              clearStoredUser();
              onClose();
              navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function ResearchTopbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const isAdmin = canAccessAdminAnalytics(user);
  const isFieldCollectionPath = location.pathname.startsWith("/research/field");
  const isSettingsPath = location.pathname.startsWith("/research/settings");
  const visibleResearchLinks = isAdmin || isFieldCollectionPath
    ? []
    : researchLinks.filter((item) => canAccessResearchRoute(user, item.path));
  const visibleFieldLinks = [
    ...fieldLinks.filter((item) => canAccessFieldRoute(user, item.path)),
    ...(isFieldCollectionPath ? [{ label: "Settings", path: "/research/settings", icon: Settings }] : []),
  ];
  const visibleAdminLinks = isAdmin && !isFieldCollectionPath ? adminLinks : [];
  const accountLabel = user?.email || user?.phone || user?.name || "FaidaFarm account";
  const roleLabel = user?.role ? user.role.replace("_", " ") : "Research user";

  return (
    <>
      <header className="hidden border-b border-slate-200 bg-white/95 px-5 py-2 backdrop-blur lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <BrandMark />
            <span className="h-4 w-px bg-slate-200" />
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Production
            </span>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <button className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Feedback
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                aria-label="Open account menu"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white">
                  <CircleUserRound className="h-4 w-4" />
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {isProfileMenuOpen ? (
                <div className="absolute right-0 top-10 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white text-sm shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-slate-950">{accountLabel}</p>
                    <p className="mt-1 text-xs capitalize text-slate-500">{roleLabel}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/research/settings");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4" />
                      Account preferences
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-slate-50"
                    >
                      <Repeat2 className="h-4 w-4" />
                      Change View
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        clearStoredUser();
                        setIsProfileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-emerald-100 bg-white/96 px-4 backdrop-blur lg:hidden">
        <BrandMark />
        {!isSettingsPath ? (
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-slate-700 shadow-[0_3px_12px_rgba(15,23,42,0.08)]"
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        ) : <BrandMark compact />}
      </header>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigate={navigate}
        visibleResearchLinks={visibleResearchLinks}
        visibleFieldLinks={visibleFieldLinks}
        visibleAdminLinks={visibleAdminLinks}
      />
    </>
  );
}
