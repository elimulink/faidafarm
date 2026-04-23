import {
  AlertCircle,
  Bell,
  CloudRain,
  Handshake,
  LineChart,
  Sprout,
  TrendingUp,
  Wallet,
  Wrench,
} from "lucide-react";

export const quickActions = [
  {
    title: "View My Farm",
    desc: "Check crop status and harvest timeline",
    icon: Sprout,
    accent: "bg-white",
    path: "/my-farm",
  },
  {
    title: "Check Market",
    desc: "See prices, trends and market insights",
    icon: LineChart,
    accent: "bg-white",
    path: "/market-intelligence",
  },
  {
    title: "Sell Now",
    desc: "View matched buyers and sell your produce",
    icon: Handshake,
    accent: "bg-[#EEF5EA]",
    path: "/sell-smart",
  },
];

export const farmOverview = {
  cropName: "Ndengu",
  stage: "Flowering Stage",
  harvestIn: "12 days",
  progress: 75,
  location: "Kitui, Kenya",
};

export const recommendation = {
  label: "AI Recommendation",
  title: "Wait 10 days before selling",
  description: "Prices are rising and demand is increasing in your region.",
};

export const priceToday = {
  crop: "Ndengu",
  value: "KES 80/kg",
  trend: "Rising",
  change: "+12% in the last 7 days",
};

export const marketRows = [
  { label: "Market Trend", value: "Positive" },
  { label: "Demand", value: "High" },
  { label: "Top Market", value: "Nairobi Market" },
];

export const recentAlerts = [
  { id: 1, title: "Rain expected tomorrow", time: "2 hours ago", icon: CloudRain },
  { id: 2, title: "Price of ndengu likely to rise", time: "5 hours ago", icon: TrendingUp },
  { id: 3, title: "High demand in Nairobi market", time: "1 day ago", icon: AlertCircle },
];

export const timelineSteps = [
  { label: "Planted", date: "20 Feb 2024", done: true },
  { label: "Germination", date: "5 Mar 2024", done: true },
  { label: "Vegetative", date: "25 Mar 2024", done: true },
  { label: "Flowering", date: "10 May 2024", done: true, current: true },
  { label: "Harvest", date: "22 May 2024", done: false },
];

export const farmCrops = [
  {
    id: 1,
    name: "Ndengu",
    stage: "Flowering Stage",
    harvestIn: "12 days",
    progress: 75,
    acreage: "2.5 acres",
    expectedYield: "18 bags",
    health: "Healthy",
  },
  {
    id: 2,
    name: "Maize",
    stage: "Vegetative",
    harvestIn: "34 days",
    progress: 48,
    acreage: "1.2 acres",
    expectedYield: "22 bags",
    health: "Stable",
  },
];

export const buyers = [
  {
    id: 1,
    name: "Nairobi Fresh Market",
    location: "Nairobi",
    offer: "KES 92/kg",
    demand: "High",
    reliability: "Verified",
  },
  {
    id: 2,
    name: "Kitui Grain Traders",
    location: "Kitui",
    offer: "KES 88/kg",
    demand: "Medium",
    reliability: "Verified",
  },
  {
    id: 3,
    name: "Eastern Supplies Ltd",
    location: "Machakos",
    offer: "KES 90/kg",
    demand: "High",
    reliability: "Reviewed",
  },
];

export const weatherCards = [
  {
    id: 1,
    title: "Rain expected tomorrow",
    desc: "Moderate rainfall expected in your area.",
    icon: CloudRain,
  },
  {
    id: 2,
    title: "Dry conditions next week",
    desc: "Prepare irrigation support for young crops.",
    icon: Wrench,
  },
];

export const financingCards = [
  {
    id: 1,
    title: "Input Loan Support",
    desc: "Access fertilizer and seed financing for the next season.",
    icon: Wallet,
  },
  {
    id: 2,
    title: "Equipment Financing",
    desc: "Finance pumps, sprayers or tools through partners.",
    icon: Wrench,
  },
];

export const supportHighlights = [
  { id: 1, label: "Active alerts", value: "3", icon: Bell },
  { id: 2, label: "Market watch", value: "Upward", icon: TrendingUp },
];
