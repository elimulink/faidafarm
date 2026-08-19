// Farmer navigation table.
//
// Lives apart from FarmerShared so that the route-to-page lookup can be shared
// with App.jsx without breaking fast refresh in a file full of components.

import {
  Bell,
  CloudRain,
  Handshake,
  Home,
  LineChart,
  Settings,
  Sprout,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { FINANCING_ENABLED } from "../../config/features";

const allSidebarItems = [
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

// Pages reachable from elsewhere rather than from the menu: weather arrives as
// alerts, and selling advice is opened by the dashboard's "See selling advice"
// button. Their routes stay live; only the nav entries go.
const OFF_MENU_KEYS = new Set(["weather", "sell-smart"]);

export const sidebarItems = allSidebarItems.filter(
  (item) =>
    !OFF_MENU_KEYS.has(item.key) && (FINANCING_ENABLED || item.key !== "financing")
);

export const mobileNavItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "My Farm", icon: Sprout, path: "/my-farm" },
  { label: "Market", icon: LineChart, path: "/market-intelligence" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

// Resolves a farmer route to the nav key and label the assistant uses as
// context for its suggested questions.
export function getFarmerPageMeta(pathname = "") {
  const path = String(pathname || "");
  const match =
    allSidebarItems.find((item) => item.path === path) ||
    allSidebarItems.find((item) => item.path !== "/dashboard" && path.startsWith(item.path));

  return { key: match?.key || "dashboard", label: match?.label || "your farm" };
}
