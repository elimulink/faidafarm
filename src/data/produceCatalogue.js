// What produce and livestock actually sell as, and for how much.
//
// The important correction here is the UNIT. Not everything is sold per kilo:
// sukuma wiki goes as a hand-fold bunch, eggs as a tray of 30, a goat as one
// animal. Pricing everything per kg is how an app ends up quoting figures no
// farmer or shopper recognises.
//
// Prices are typical Kenyan ranges, not quotes. They move with season and
// market - dry season and the festive weeks push livestock up sharply - so
// each entry carries a range rather than a single confident number.

export const UNITS = {
  bunch: { id: "bunch", label: "bunch", plural: "bunches", note: "a hand-fold", approxKg: 0.35 },
  kg: { id: "kg", label: "kg", plural: "kg", note: "", approxKg: 1 },
  head: { id: "head", label: "head", plural: "heads", note: "one whole cabbage", approxKg: 1.5 },
  animal: { id: "animal", label: "animal", plural: "animals", note: "per animal", approxKg: 0 },
  bird: { id: "bird", label: "bird", plural: "birds", note: "per bird", approxKg: 2 },
  tray: { id: "tray", label: "tray", plural: "trays", note: "30 eggs", approxKg: 1.8 },
  gunia: { id: "gunia", label: "gunia", plural: "magunia", note: "90 kg sack", approxKg: 90 },
};

export const PRODUCE_CATEGORIES = [
  { id: "vegetables", label: "Vegetables" },
  { id: "staples", label: "Cereals & pulses" },
  { id: "livestock", label: "Livestock" },
  { id: "poultry", label: "Poultry & eggs" },
];

export const produce = [
  {
    id: "sukuma-wiki",
    name: "Sukuma wiki",
    aliases: ["Kale", "Collard greens"],
    category: "vegetables",
    unit: "bunch",
    image: "/produce/sukuma-wiki.jpg",
    farmGate: [12, 20],
    market: [25, 35],
    note: "Sold as a hand-fold, not by weight. Size of the fold varies more than the price does.",
  },
  {
    id: "spinach",
    name: "Spinach",
    aliases: ["Managu substitute"],
    category: "vegetables",
    unit: "bunch",
    image: "/produce/spinach.jpg",
    farmGate: [15, 25],
    market: [30, 40],
    note: "Same hand-fold as sukuma wiki, usually a few shillings more.",
  },
  {
    id: "cabbage",
    name: "Cabbage",
    aliases: ["Kabichi"],
    category: "vegetables",
    unit: "kg",
    image: "/produce/cabbage.jpg",
    farmGate: [25, 35],
    market: [50, 60],
    note: "Priced per kilo at the market; a whole head is usually 1.5 to 3 kg.",
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    aliases: ["Nyanya"],
    category: "vegetables",
    unit: "kg",
    image: "/produce/tomatoes.jpg",
    farmGate: [30, 45],
    market: [70, 90],
    note: "The widest gap of any crop here, because tomatoes spoil fast and the risk sits with whoever holds them.",
  },
  {
    id: "onion",
    name: "Onions",
    aliases: ["Kitunguu"],
    category: "vegetables",
    unit: "kg",
    image: "/produce/onion.jpg",
    farmGate: [40, 60],
    market: [90, 120],
    note: "Stores better than tomatoes, so the price holds through the season.",
  },
  {
    id: "maize",
    name: "Maize (dry)",
    aliases: ["Mahindi"],
    category: "staples",
    unit: "gunia",
    image: "/produce/maize.jpg",
    farmGate: [3600, 4500],
    market: [5000, 5800],
    note: "Traded by the 90 kg gunia. Per kilo that is roughly 40 to 50 at the farm.",
  },
  {
    id: "ndengu",
    name: "Ndengu",
    aliases: ["Green grams"],
    category: "staples",
    unit: "kg",
    image: "/produce/ndengu.jpg",
    farmGate: [78, 84],
    market: [85, 95],
    note: "A thin gap. Ndengu is dry and stores well, so traders have already competed the margin down.",
  },
  {
    id: "goat",
    name: "Goat",
    aliases: ["Mbuzi"],
    category: "livestock",
    unit: "animal",
    image: "/produce/goat.jpg",
    farmGate: [9000, 14000],
    market: [14000, 20000],
    quotation: true,
    note: "Priced by eye - size, condition and age. Buyers quote per animal, and prices climb before Christmas and Easter.",
  },
  {
    id: "sheep",
    name: "Sheep",
    aliases: ["Kondoo"],
    category: "livestock",
    unit: "animal",
    image: "/produce/sheep.jpg",
    farmGate: [9000, 14000],
    market: [14000, 20000],
    quotation: true,
    note: "Sold like goats, per animal after inspection.",
  },
  {
    id: "cow",
    name: "Cattle",
    aliases: ["Ng'ombe"],
    category: "livestock",
    unit: "animal",
    image: "/produce/cow.jpg",
    farmGate: [45000, 90000],
    market: [60000, 120000],
    quotation: true,
    note: "A heifer and a mature bull are different markets - roughly 60,000 to 80,000 against 80,000 to 120,000.",
  },
  {
    id: "kienyeji-chicken",
    name: "Kienyeji chicken",
    aliases: ["Indigenous chicken"],
    category: "poultry",
    unit: "bird",
    image: "/produce/chicken.jpg",
    farmGate: [700, 1000],
    market: [900, 1500],
    quotation: true,
    note: "A mature cock of 2.5 to 3 kg fetches more than a hen. Prices peak at Christmas and Easter.",
  },
  {
    id: "eggs",
    name: "Kienyeji eggs",
    aliases: ["Mayai"],
    category: "poultry",
    unit: "tray",
    image: "/produce/eggs.jpg",
    farmGate: [400, 550],
    market: [500, 800],
    note: "A tray is 30 eggs. Kienyeji eggs carry a premium over layer eggs.",
  },
];

export function unitOf(item) {
  return UNITS[item.unit] || UNITS.kg;
}

export function formatRange([low, high]) {
  return low === high
    ? `KES ${low.toLocaleString()}`
    : `KES ${low.toLocaleString()}–${high.toLocaleString()}`;
}

// Priced per unit, so "per bunch" or "per animal" rather than a bare number.
export function formatUnitPrice(range, item) {
  return `${formatRange(range)} per ${unitOf(item).label}`;
}

function midpoint([low, high]) {
  return (low + high) / 2;
}

// How much more the market pays than the farm gate, as a percentage. This is
// the number that says whether moving the produce is worth anything.
export function getSpreadPct(item) {
  const gate = midpoint(item.farmGate);
  return gate ? Math.round(((midpoint(item.market) - gate) / gate) * 100) : 0;
}

export function getProduceByCategory(categoryId) {
  return produce.filter((item) => item.category === categoryId);
}
