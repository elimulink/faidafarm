import {
  BarChart3,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Map,
  RefreshCw,
  Send,
  Settings,
  Utensils,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { canAccessAdminAnalytics, canAccessFieldRoute, canAccessResearchRoute } from "../researchAccess";

const researchItems = [
  { label: "Dashboard", path: "/research", icon: LayoutDashboard },
  { label: "Households", path: "/research/households", icon: BarChart3 },
  { label: "FMNR", path: "/research/fmnr-plots", icon: Map },
  { label: "Nutrition", path: "/research/child-nutrition", icon: Utensils },
  { label: "Settings", path: "/research/settings", icon: Settings },
];

const fieldItems = [
  { label: "Home", path: "/research/field", icon: ClipboardList },
  { label: "Forms", path: "/research/field/forms", icon: FileText },
  { label: "Submits", path: "/research/field/submissions", icon: Send },
  { label: "Sync", path: "/research/field/sync-queue", icon: RefreshCw },
  { label: "Settings", path: "/research/settings", icon: Settings },
];

const adminItems = [
  { label: "Overview", path: "/research/admin", icon: LayoutDashboard },
  { label: "Map", path: "/research/admin/fmnr-map", icon: Map },
  { label: "Diet", path: "/research/admin/diet-scores", icon: Utensils },
  { label: "Exports", path: "/research/admin/exports", icon: Download },
  { label: "Settings", path: "/research/settings", icon: Settings },
];

function isItemActive(pathname, itemPath) {
  if (itemPath === "/research" || itemPath === "/research/field" || itemPath === "/research/admin") {
    return pathname === itemPath;
  }

  if (itemPath === "/research/field/forms") {
    return pathname === itemPath || pathname.startsWith("/research/field/forms/");
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export default function ResearchMobileBottomNav({ user }) {
  const location = useLocation();
  const isField = location.pathname.startsWith("/research/field");
  const isAdmin = location.pathname.startsWith("/research/admin");

  const items = isField
    ? fieldItems.filter((item) => canAccessFieldRoute(user, item.path))
    : isAdmin && canAccessAdminAnalytics(user)
      ? adminItems
      : researchItems.filter((item) => canAccessResearchRoute(user, item.path));

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/96 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-1.5">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isItemActive(location.pathname, item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/research" || item.path === "/research/field" || item.path === "/research/admin"}
              className="flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5"
            >
              <Icon className={`h-5 w-5 ${active ? "text-green-700" : "text-slate-500"}`} />
              <span className={`text-[10px] ${active ? "font-semibold text-green-700" : "text-slate-500"}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
