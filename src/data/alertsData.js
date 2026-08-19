// Alerts a farmer should act on.
//
// Each one carries a severity, the reason behind it, and somewhere to go - an
// alert the farmer cannot act on is just noise. Timestamps are relative to now
// so the grouping stays sensible whenever the app is opened.

const HOUR = 60 * 60 * 1000;

// Severity is a status, so it always ships with a label and an icon name, never
// colour on its own.
export const SEVERITIES = {
  urgent: { label: "Urgent", tone: "#C2542F", surface: "#FBEEE9", border: "#F2D6CB" },
  attention: { label: "Worth a look", tone: "#B77A18", surface: "#FDF8EE", border: "#F2E2C4" },
  info: { label: "For information", tone: "#2F8F46", surface: "#F1F6EE", border: "#DCEAD5" },
};

const RAW_ALERTS = [
  {
    id: "alert-rain",
    severity: "urgent",
    category: "Weather",
    title: "Heavy rain expected tomorrow",
    detail:
      "40-60 mm forecast for Kitui from tomorrow afternoon. If you have produce drying, cover it tonight - wet grain grades lower and fetches less.",
    hoursAgo: 2,
    action: { label: "See the forecast", to: "/weather" },
  },
  {
    id: "alert-price",
    severity: "attention",
    category: "Price",
    title: "Ndengu is up 12% this week",
    detail:
      "The price has risen from KES 71 to KES 80/kg over seven days and has not flattened yet. Holding a little longer still looks better than selling today.",
    hoursAgo: 5,
    action: { label: "Open market prices", to: "/market-intelligence" },
  },
  {
    id: "alert-buyer",
    severity: "attention",
    category: "Buyers",
    title: "Athi Export Partners is paying KES 96/kg",
    detail:
      "That is 20% above the market reference, but they need at least 2,000 kg and pay 14 days after delivery. Worth it only if you can fill the volume and wait for payment.",
    hoursAgo: 26,
    action: { label: "View buyer", to: "/find-buyers" },
  },
  {
    id: "alert-demand",
    severity: "info",
    category: "Buyers",
    title: "Demand is high in Nairobi market",
    detail:
      "Traders in Nairobi are actively buying ndengu this week at KES 92/kg. Nairobi is 172 km away, so factor transport into the difference.",
    hoursAgo: 30,
    action: { label: "Compare buyers", to: "/find-buyers" },
  },
  {
    id: "alert-harvest",
    severity: "info",
    category: "Crop",
    title: "Harvest window opens in 12 days",
    detail:
      "Your ndengu is at flowering stage. Plan drying space and transport now so you are not selling in a rush at whatever price you are offered.",
    hoursAgo: 52,
    action: { label: "Open My Farm", to: "/my-farm" },
  },
];

export const alerts = RAW_ALERTS.map((alert) => ({
  ...alert,
  createdAt: Date.now() - alert.hoursAgo * HOUR,
}));

export const alertCategories = [...new Set(alerts.map((alert) => alert.category))];

export function formatAlertAge(timestamp) {
  const hours = Math.max(0, Math.round((Date.now() - timestamp) / HOUR));

  if (hours < 1) {
    return "Just now";
  }
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const READ_KEY = "faidafarm_read_alerts";

export function loadReadAlerts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReadAlerts(ids = []) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Losing read state is not worth breaking the page over.
  }
}
