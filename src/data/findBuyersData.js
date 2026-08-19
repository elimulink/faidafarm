// Buyer directory for the Find Buyers module.
//
// Still mock data, but shaped like the records the backend will return so the
// swap to /api/v1/farmer/buyers is a fetch call and nothing more.

// Reference price the farmer is comparing offers against (see priceToday).
export const MARKET_REFERENCE_PRICE = 80;

export const buyers = [
  {
    id: "byr-001",
    name: "Nairobi Fresh Market",
    type: "Market trader",
    town: "Nairobi",
    county: "Nairobi",
    distanceKm: 172,
    crops: ["Ndengu", "Cowpeas", "Maize"],
    offerPerKg: 92,
    demand: "High",
    verification: "verified",
    rating: 4.8,
    trades: 214,
    paymentTerms: "Cash on delivery",
    minVolumeKg: 500,
    lastActiveDays: 1,
    phone: "+254700100101",
    transport: "Buyer collects",
  },
  {
    id: "byr-002",
    name: "Kitui Grain Traders",
    type: "Aggregator",
    town: "Kitui",
    county: "Kitui",
    distanceKm: 8,
    crops: ["Ndengu", "Sorghum", "Millet"],
    offerPerKg: 88,
    demand: "Medium",
    verification: "verified",
    rating: 4.6,
    trades: 96,
    paymentTerms: "Cash on delivery",
    minVolumeKg: 100,
    lastActiveDays: 1,
    phone: "+254700100102",
    transport: "Buyer collects",
  },
  {
    id: "byr-003",
    name: "Eastern Supplies Ltd",
    type: "Processor",
    town: "Machakos",
    county: "Machakos",
    distanceKm: 96,
    crops: ["Ndengu", "Pigeon peas"],
    offerPerKg: 90,
    demand: "High",
    verification: "reviewed",
    rating: 4.3,
    trades: 61,
    paymentTerms: "7 days after delivery",
    minVolumeKg: 1000,
    lastActiveDays: 3,
    phone: "+254700100103",
    transport: "Farmer delivers",
  },
  {
    id: "byr-004",
    name: "Mwingi Farmers Cooperative",
    type: "Cooperative",
    town: "Mwingi",
    county: "Kitui",
    distanceKm: 42,
    crops: ["Ndengu", "Cowpeas"],
    offerPerKg: 85,
    demand: "High",
    verification: "verified",
    rating: 4.7,
    trades: 133,
    paymentTerms: "Cash on delivery",
    minVolumeKg: 50,
    lastActiveDays: 2,
    phone: "+254700100104",
    transport: "Buyer collects",
  },
  {
    id: "byr-005",
    name: "Athi Export Partners",
    type: "Exporter",
    town: "Athi River",
    county: "Machakos",
    distanceKm: 128,
    crops: ["Ndengu", "French beans", "Avocado"],
    offerPerKg: 96,
    demand: "Medium",
    verification: "verified",
    rating: 4.5,
    trades: 78,
    paymentTerms: "14 days after delivery",
    minVolumeKg: 2000,
    lastActiveDays: 5,
    phone: "+254700100105",
    transport: "Farmer delivers",
  },
  {
    id: "byr-006",
    name: "Kibwezi Produce Hub",
    type: "Aggregator",
    town: "Kibwezi",
    county: "Makueni",
    distanceKm: 74,
    crops: ["Ndengu", "Sorghum"],
    offerPerKg: 83,
    demand: "Low",
    verification: "reviewed",
    rating: 3.9,
    trades: 24,
    paymentTerms: "Cash on delivery",
    minVolumeKg: 100,
    lastActiveDays: 11,
    phone: "+254700100106",
    transport: "Farmer delivers",
  },
  {
    id: "byr-007",
    name: "Wote Millers",
    type: "Processor",
    town: "Wote",
    county: "Makueni",
    distanceKm: 88,
    crops: ["Maize", "Sorghum", "Millet"],
    offerPerKg: 79,
    demand: "Medium",
    verification: "unverified",
    rating: 3.6,
    trades: 9,
    paymentTerms: "7 days after delivery",
    minVolumeKg: 300,
    lastActiveDays: 18,
    phone: "+254700100107",
    transport: "Farmer delivers",
  },
  {
    id: "byr-008",
    name: "Kitui Town Grocers",
    type: "Market trader",
    town: "Kitui",
    county: "Kitui",
    distanceKm: 6,
    crops: ["Ndengu", "Tomatoes", "Kale"],
    offerPerKg: 86,
    demand: "High",
    verification: "reviewed",
    rating: 4.1,
    trades: 47,
    paymentTerms: "Cash on delivery",
    minVolumeKg: 20,
    lastActiveDays: 1,
    phone: "+254700100108",
    transport: "Buyer collects",
  },
];

const DEMAND_SCORE = { High: 1, Medium: 0.6, Low: 0.2 };
const VERIFICATION_SCORE = { verified: 1, reviewed: 0.6, unverified: 0.2 };

export const verificationLabels = {
  verified: "Verified",
  reviewed: "Reviewed",
  unverified: "Unverified",
};

// Weights are exported so the UI can explain the score instead of asserting it.
export const MATCH_WEIGHTS = { price: 40, distance: 25, reliability: 20, demand: 15 };

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// Price: at the reference price a buyer scores 0, at +20% or better it scores 1.
function priceFactor(offerPerKg) {
  const premium = (offerPerKg - MARKET_REFERENCE_PRICE) / MARKET_REFERENCE_PRICE;
  return clamp01(premium / 0.2);
}

// Distance: full marks within 10 km, nothing beyond 200 km.
function distanceFactor(distanceKm) {
  return clamp01((200 - distanceKm) / 190);
}

// Reliability blends the verification tier with a track record that saturates
// at 100 completed trades, so a new-but-verified buyer is not scored as proven.
function reliabilityFactor(buyer) {
  const tier = VERIFICATION_SCORE[buyer.verification] ?? 0.2;
  const record = clamp01(buyer.trades / 100);
  return tier * 0.65 + record * 0.35;
}

export function getMatchScore(buyer) {
  const score =
    priceFactor(buyer.offerPerKg) * MATCH_WEIGHTS.price +
    distanceFactor(buyer.distanceKm) * MATCH_WEIGHTS.distance +
    reliabilityFactor(buyer) * MATCH_WEIGHTS.reliability +
    (DEMAND_SCORE[buyer.demand] ?? 0.2) * MATCH_WEIGHTS.demand;

  return Math.round(score);
}

// The single strongest reason this buyer ranks where it does, so the farmer can
// see what the match is actually based on.
export function getMatchReason(buyer) {
  const parts = [
    { weight: priceFactor(buyer.offerPerKg) * MATCH_WEIGHTS.price, text: pricePremiumLabel(buyer) },
    {
      weight: distanceFactor(buyer.distanceKm) * MATCH_WEIGHTS.distance,
      text: `Only ${buyer.distanceKm} km away`,
    },
    {
      weight: reliabilityFactor(buyer) * MATCH_WEIGHTS.reliability,
      text: `${verificationLabels[buyer.verification]} with ${buyer.trades} completed sales`,
    },
    {
      weight: (DEMAND_SCORE[buyer.demand] ?? 0.2) * MATCH_WEIGHTS.demand,
      text: `${buyer.demand} demand right now`,
    },
  ];

  return parts.sort((a, b) => b.weight - a.weight)[0].text;
}

export function getPricePremium(buyer) {
  return Math.round(
    ((buyer.offerPerKg - MARKET_REFERENCE_PRICE) / MARKET_REFERENCE_PRICE) * 100
  );
}

function pricePremiumLabel(buyer) {
  const premium = getPricePremium(buyer);

  if (premium > 0) {
    return `Pays ${premium}% above the market price`;
  }

  if (premium < 0) {
    return `Pays ${Math.abs(premium)}% below the market price`;
  }

  return "Pays the market price";
}

export function getLastActiveLabel(buyer) {
  if (buyer.lastActiveDays <= 1) {
    return "Active today";
  }

  if (buyer.lastActiveDays <= 7) {
    return `Active ${buyer.lastActiveDays} days ago`;
  }

  return `Last active ${Math.floor(buyer.lastActiveDays / 7)} weeks ago`;
}

export const buyerCrops = [...new Set(buyers.flatMap((buyer) => buyer.crops))].sort();
export const buyerCounties = [...new Set(buyers.map((buyer) => buyer.county))].sort();

export const sortOptions = [
  { id: "match", label: "Best match" },
  { id: "price", label: "Highest price" },
  { id: "distance", label: "Nearest" },
  { id: "rating", label: "Best rated" },
];
