// Maps API payloads onto the shapes the pages already draw.
//
// Kept as pure functions, apart from the components, so the mapping can be read
// and corrected in one place - and so a field the backend does not carry yet is
// visibly absent here rather than silently undefined inside JSX.

const DAY = 24 * 60 * 60 * 1000;

function toTimestamp(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? Date.now() : date.getTime();
}

// The backend stores free-text severity; the page keys a colour off three known
// values, so anything unrecognised lands on the calmest of them rather than
// rendering an undefined tone.
const SEVERITY_ALIASES = {
  urgent: "urgent",
  critical: "urgent",
  high: "urgent",
  danger: "urgent",
  attention: "attention",
  warning: "attention",
  medium: "attention",
  info: "info",
  low: "info",
  notice: "info",
};

export function adaptAlert(alert) {
  return {
    id: alert.id,
    severity: SEVERITY_ALIASES[String(alert.severity || "").toLowerCase()] || "info",
    category: alert.category || "General",
    title: alert.title || "",
    detail: alert.message || "",
    createdAt: toTimestamp(alert.created_at),
    readAt: alert.read_at ? toTimestamp(alert.read_at) : null,
    // The sample alerts carry a deep link. Stored alerts do not, and inventing
    // one would send farmers to the wrong screen.
    action: null,
  };
}

export const adaptAlerts = (payload) => (payload || []).map(adaptAlert);

export function adaptMarketPrice(row) {
  return {
    id: row.id,
    crop: row.crop_name,
    market: row.market_name,
    county: row.county || "",
    unit: row.unit || "KES/kg",
    price: Number(row.price),
    source: row.source || "",
    date: new Date(row.observed_at),
  };
}

export const adaptMarketPrices = (payload) => (payload || []).map(adaptMarketPrice);

/** The price chart wants {date, price} ascending, one point per observation. */
export function toPriceSeries(rows) {
  return [...(rows || [])]
    .map(adaptMarketPrice)
    .sort((a, b) => a.date - b.date)
    .map((row) => ({ date: row.date, price: row.price }));
}

function harvestIn(value) {
  if (!value) {
    return null;
  }
  const days = Math.round((new Date(value).getTime() - Date.now()) / DAY);
  if (Number.isNaN(days)) {
    return null;
  }
  if (days < 0) {
    return "Ready now";
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

/** Percent of the way from planting to expected harvest. */
function growthProgress(crop) {
  if (crop.progress_percent != null) {
    return crop.progress_percent;
  }

  // Derived rather than stored where possible: a percentage typed in once goes
  // stale the next day, while two dates stay correct on their own.
  if (!crop.planted_at || !crop.expected_harvest_date) {
    return null;
  }

  const planted = new Date(crop.planted_at).getTime();
  const harvest = new Date(crop.expected_harvest_date).getTime();
  if (Number.isNaN(planted) || Number.isNaN(harvest) || harvest <= planted) {
    return null;
  }

  const elapsed = (Date.now() - planted) / (harvest - planted);
  return Math.round(Math.min(1, Math.max(0, elapsed)) * 100);
}

export function adaptCrop(crop) {
  const acreage = crop.acreage == null ? null : Number(crop.acreage);
  return {
    id: crop.id,
    name: crop.name,
    variety: crop.variety || "",
    season: crop.season || "",
    acreage: acreage == null ? null : `${acreage} acre${acreage === 1 ? "" : "s"}`,
    harvestIn: harvestIn(crop.expected_harvest_date),
    plantedAt: crop.planted_at ? new Date(crop.planted_at) : null,
    stage: crop.stage || null,
    progress: growthProgress(crop),
    expectedYield: crop.expected_yield || null,
    health: crop.health || null,
  };
}

export const adaptCrops = (payload) => (payload || []).map(adaptCrop);

export function adaptFarm(farm) {
  return {
    id: farm.id,
    name: farm.name,
    county: farm.county || "",
    subCounty: farm.sub_county || "",
    ward: farm.ward || "",
    sizeAcres: farm.size_acres == null ? null : Number(farm.size_acres),
    soilType: farm.soil_type || "",
    latitude: farm.latitude,
    longitude: farm.longitude,
  };
}

export const adaptFarms = (payload) => (payload || []).map(adaptFarm);

export function adaptDashboard(payload) {
  return {
    farmsCount: payload?.farms_count ?? 0,
    activeAlertsCount: payload?.active_alerts_count ?? 0,
    marketPrices: adaptMarketPrices(payload?.recent_market_prices),
    alerts: adaptAlerts(payload?.recent_alerts),
  };
}

export function adaptBuyer(buyer) {
  const lastActive = buyer.last_active_at
    ? Math.max(0, Math.round((Date.now() - toTimestamp(buyer.last_active_at)) / DAY))
    : null;

  return {
    id: buyer.id,
    name: buyer.name,
    channel: buyer.channel || "local",
    type: buyer.buyer_type || "Buyer",
    town: buyer.town || buyer.county || "",
    county: buyer.county || "",
    distanceKm: buyer.distance_km,
    // Stored as free text ("Ndengu, Maize") because a buyer's interests are
    // typed in, not picked from a list.
    crops: String(buyer.crop_interests || "")
      .split(",")
      .map((crop) => crop.trim())
      .filter(Boolean),
    offerPerKg: buyer.offer_per_kg == null ? null : Number(buyer.offer_per_kg),
    demand: buyer.demand || "Unknown",
    verification: buyer.verification || "unverified",
    rating: buyer.rating,
    trades: buyer.trades ?? 0,
    paymentTerms: buyer.payment_terms || "",
    minVolumeKg: buyer.min_volume_kg,
    lastActiveDays: lastActive,
    phone: buyer.contact_phone || "",
    transport: buyer.transport || "",
  };
}

export const adaptBuyers = (payload) => (payload || []).map(adaptBuyer);
