import {
  Bell,
  BarChart3,
  CircleHelp,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  RefreshCw,
  Repeat2,
  Scale,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Utensils,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../../auth/session";
import { canAccessAdminAnalytics, canAccessFieldRoute, canAccessResearchRoute } from "../researchAccess";

const researchNavItems = [
  { label: "Research Dashboard", path: "/research", icon: LayoutDashboard },
  { label: "Households", path: "/research/households", icon: BarChart3 },
  { label: "FMNR Plots", path: "/research/fmnr-plots", icon: Map },
  { label: "Child Nutrition", path: "/research/child-nutrition", icon: Utensils },
  { label: "Field Activity", path: "/research/field-activity", icon: BarChart3 },
  { label: "Sync Status", path: "/research/sync-status", icon: Download },
  { label: "Reports", path: "/research/reports", icon: BarChart3 },
];

const adminNavItems = [
  { label: "Admin Overview", path: "/research/admin", icon: LayoutDashboard },
  { label: "FMNR Map", path: "/research/admin/fmnr-map", icon: Map },
  { label: "Diet Scores", path: "/research/admin/diet-scores", icon: Utensils },
  { label: "County Comparison", path: "/research/admin/county", icon: Scale },
  { label: "Exports", path: "/research/admin/exports", icon: Download },
];

const fieldNavItems = [
  { label: "Field Home", path: "/research/field", icon: ClipboardList },
  { label: "Forms Library", path: "/research/field/forms", icon: FileText },
  { label: "New Form", path: "/research/field/forms/new", icon: PenLine },
  { label: "Submissions", path: "/research/field/submissions", icon: Send },
  { label: "Drafts", path: "/research/field/drafts", icon: FileText },
  { label: "Devices", path: "/research/field/devices", icon: Smartphone },
  { label: "Sync Queue", path: "/research/field/sync-queue", icon: RefreshCw },
];

const settingsItems = [
  { label: "Profile", description: "Name and organization", path: "/research/settings/profile", icon: UserRound },
  { label: "Security", description: "Email and password", path: "/research/settings/security", icon: ShieldCheck },
  { label: "Preferences", description: "Theme and layout", path: "/research/settings/preferences", icon: SlidersHorizontal },
  { label: "Notifications", description: "Alerts and sync notices", path: "/research/settings/notifications", icon: Bell },
  { label: "Help", description: "Support and privacy", path: "/research/settings/help", icon: CircleHelp },
];

function SidebarGroup({ title, items, collapsed }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {!collapsed ? (
        <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </p>
      ) : null}
      <div className={collapsed ? "space-y-1.5" : "divide-y divide-slate-100"}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition ${
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-green-50 text-green-900 ring-1 ring-green-100"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default function ResearchSidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = canAccessAdminAnalytics(user);
  const isFieldCollectionPath = location.pathname.startsWith("/research/field");
  const visibleResearchItems = isAdmin || isFieldCollectionPath
    ? []
    : researchNavItems.filter((item) => canAccessResearchRoute(user, item.path));
  const visibleFieldItems = fieldNavItems.filter((item) => canAccessFieldRoute(user, item.path));
  const visibleAdminItems = isAdmin && !isFieldCollectionPath ? adminNavItems : [];
  const workspaceLabel = isFieldCollectionPath
    ? "Field Collection"
    : isAdmin
      ? "Admin Analytics"
      : "Research Mode";
  const brandPath = isFieldCollectionPath ? "/research/field" : isAdmin ? "/research/admin" : "/research";
  const accountLabel = user?.email || user?.phone || user?.name || "researcher@faidafarm.app";
  const roleLabel = user?.role ? user.role.replace("_", " ") : "Researcher";

  function navigateFromPopover(path) {
    setIsSettingsOpen(false);
    setIsAccountOpen(false);
    navigate(path);
  }

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white py-5 transition-[width] duration-200 lg:flex lg:flex-col ${
        collapsed ? "w-[72px] px-3" : "w-72 px-4"
      }`}
    >
      <div className={`mb-7 flex items-start ${collapsed ? "flex-col items-center gap-2" : "justify-between gap-3"}`}>
        <Link
          to={brandPath}
          className={`rounded-xl hover:bg-slate-50 ${collapsed ? "p-2" : "block -m-2 p-2"}`}
          title={collapsed ? workspaceLabel : undefined}
        >
          {collapsed ? (
            <img src="/logo.png" alt="FaidaFarm" className="h-8 w-8 object-contain" />
          ) : (
            <>
              <h1 className="text-lg font-bold text-[#0F172A]">FaidaFarm</h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                {workspaceLabel}
              </p>
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className={`flex-1 space-y-6 overflow-hidden border-t border-slate-100 pt-5 ${collapsed ? "px-0" : ""}`}>
        <SidebarGroup title="Research Mode" items={visibleResearchItems} collapsed={collapsed} />
        <SidebarGroup title="Field Collection" items={visibleFieldItems} collapsed={collapsed} />
        <SidebarGroup title="Admin Analytics" items={visibleAdminItems} collapsed={collapsed} />
      </nav>

      <div className="relative mt-auto border-t border-slate-100 pt-3">
        {isSettingsOpen ? (
          <div className={`absolute bottom-24 z-50 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ${collapsed ? "left-14" : "left-0"}`}>
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-slate-950">Settings</p>
              <p className="mt-0.5 text-xs text-slate-500">Choose a settings page</p>
            </div>
            <div className="py-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigateFromPopover(item.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      active ? "bg-green-50 text-green-900" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="block text-xs text-slate-500">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {isAccountOpen ? (
          <div className={`absolute bottom-14 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] ${collapsed ? "left-14" : "left-0"}`}>
            <div className="bg-slate-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-950">{accountLabel}</p>
              <p className="mt-0.5 text-xs capitalize text-slate-500">{roleLabel}</p>
            </div>
            <div className="p-2">
              <button
                type="button"
                onClick={() => navigateFromPopover("/research/settings/profile")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <UserRound className="h-4 w-4" />
                Account preferences
              </button>
              <button
                type="button"
                onClick={() => navigateFromPopover("/login")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <Repeat2 className="h-4 w-4" />
                Change View
              </button>
              <button
                type="button"
                onClick={() => {
                  clearStoredUser();
                  navigateFromPopover("/login");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setIsSettingsOpen((value) => !value);
            setIsAccountOpen(false);
          }}
          className={`mb-2 flex w-full items-center rounded-xl text-sm font-medium transition ${
            collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-2.5"
          } ${
            location.pathname.startsWith("/research/settings")
              ? "bg-green-50 text-green-900 ring-1 ring-green-100"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          }`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed ? <span>Settings</span> : null}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsAccountOpen((value) => !value);
            setIsSettingsOpen(false);
          }}
          className={`flex w-full items-center rounded-2xl border border-slate-100 bg-slate-50 text-left transition hover:bg-slate-100 ${
            collapsed ? "justify-center p-2" : "gap-3 p-2.5"
          }`}
          title={collapsed ? accountLabel : undefined}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9B7A6C] text-sm font-semibold text-white">
            {(user?.name || accountLabel || "R").charAt(0).toUpperCase()}
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-950">{accountLabel}</span>
              <span className="block truncate text-xs capitalize text-slate-500">{roleLabel}</span>
            </span>
          ) : null}
        </button>
      </div>
    </aside>
  );
}
