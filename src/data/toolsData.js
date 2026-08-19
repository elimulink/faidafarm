// Equipment a farmer can hire, buy, or book as a service.
//
// SAMPLE LISTINGS. Manufacturer names (John Deere, Massey Ferguson, Honda,
// Jacto) are the real makers of the equipment shown, which is how any listing
// names a product. The sellers are invented placeholders - no real company has
// been onboarded or verified yet, and none should be named here until they have
// actually agreed to appear.

export const TOOL_CATEGORIES = [
  { id: "hire", label: "Hire", blurb: "Machinery and animals by the day or acre" },
  { id: "sale", label: "Buy", blurb: "Tools and equipment for sale" },
  { id: "service", label: "Services", blurb: "Work done for you" },
];

// A seller is only shown as verified once a person has checked the business is
// real, so the badge means something.
const SELLERS = {
  kituiMachinery: {
    id: "kitui-machinery",
    name: "Kitui Farm Machinery",
    county: "Kitui",
    verified: true,
    since: 2021,
    phone: "+254700200201",
  },
  mwingiTraction: {
    id: "mwingi-traction",
    name: "Mwingi Animal Traction",
    county: "Kitui",
    verified: true,
    since: 2019,
    phone: "+254700200202",
  },
  ukambaniSupplies: {
    id: "ukambani-supplies",
    name: "Ukambani Agri Supplies",
    county: "Machakos",
    verified: true,
    since: 2018,
    phone: "+254700200203",
  },
  athiIrrigation: {
    id: "athi-irrigation",
    name: "Athi Irrigation Hire",
    county: "Machakos",
    verified: false,
    since: 2024,
    phone: "+254700200204",
  },
  sunfarmSolar: {
    id: "sunfarm-solar",
    name: "SunFarm Solar Kenya",
    county: "Nairobi",
    verified: true,
    since: 2020,
    phone: "+254700200205",
  },
};

export const listings = [
  {
    id: "tractor-jd-6120m",
    category: "hire",
    name: "Tractor with plough",
    brand: "John Deere 6120M",
    image: "/tools/tractor.jpg",
    price: { amount: 3500, unit: "per acre" },
    summary: "Ploughing and harrowing with an operator included.",
    description:
      "A 120 hp tractor with mouldboard plough and disc harrow, hired with an operator and fuel. Best booked two weeks before the rains, when demand is highest and dates go quickly.",
    specs: [
      ["Power", "120 hp"],
      ["Includes", "Operator and fuel"],
      ["Minimum booking", "2 acres"],
      ["Travel", "Free within 20 km of Kitui town"],
    ],
    seller: SELLERS.kituiMachinery,
    rating: 4.7,
    reviews: 38,
  },
  {
    id: "planter-mf-seed-drill",
    category: "hire",
    name: "Seed drill planter",
    brand: "Massey Ferguson",
    image: "/tools/planter.jpg",
    price: { amount: 2800, unit: "per acre" },
    summary: "Even spacing and depth, far faster than planting by hand.",
    description:
      "A tractor-drawn seed drill that places seed and fertiliser at a set depth and spacing. Even spacing is what lifts yield over hand planting, and it covers an acre in well under an hour.",
    specs: [
      ["Rows", "4 rows"],
      ["Suits", "Maize, beans, ndengu, sorghum"],
      ["Includes", "Tractor and operator"],
      ["Minimum booking", "2 acres"],
    ],
    seller: SELLERS.kituiMachinery,
    rating: 4.5,
    reviews: 21,
  },
  {
    id: "ox-plough-pair",
    category: "hire",
    name: "Ox plough and team",
    brand: "Local traction",
    image: "/tools/ox-plough.jpg",
    price: { amount: 1200, unit: "per day" },
    summary: "A pair of oxen with plough and handler, for smaller plots.",
    description:
      "A trained pair of oxen with a mouldboard plough and a handler. Cheaper than a tractor on small or steep plots, and it can work ground a tractor cannot reach.",
    specs: [
      ["Covers", "About 1 acre per day"],
      ["Includes", "Handler"],
      ["Suits", "Plots under 3 acres"],
      ["Travel", "Within 15 km of Mwingi"],
    ],
    seller: SELLERS.mwingiTraction,
    rating: 4.8,
    reviews: 54,
  },
  {
    id: "maize-sheller",
    category: "hire",
    name: "Maize sheller",
    brand: "Petrol powered",
    image: "/tools/maize-sheller.jpg",
    price: { amount: 1500, unit: "per day" },
    summary: "Shells a harvest in hours instead of days.",
    description:
      "A petrol-driven sheller that separates maize grain from the cob. What takes a family several days by hand is done in a morning, and the grain comes out cleaner, which grades better.",
    specs: [
      ["Output", "About 1 tonne per hour"],
      ["Fuel", "Petrol, supplied by hirer"],
      ["Includes", "Delivery within 10 km"],
      ["Deposit", "KES 2,000, refundable"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.4,
    reviews: 17,
  },
  {
    id: "chaff-cutter",
    category: "hire",
    name: "Chaff cutter",
    brand: "Belt driven",
    image: "/tools/chaff-cutter.jpg",
    price: { amount: 900, unit: "per day" },
    summary: "Chops stover and fodder for livestock feed.",
    description:
      "Cuts maize stover, napier grass and other fodder into short lengths so animals waste less of it. Useful right after harvest when there is stover to use up.",
    specs: [
      ["Output", "About 500 kg per hour"],
      ["Power", "Belt driven, needs a motor or tractor PTO"],
      ["Includes", "Delivery within 10 km"],
      ["Deposit", "KES 1,500, refundable"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.2,
    reviews: 11,
  },
  {
    id: "water-pump-honda",
    category: "hire",
    name: "Petrol water pump",
    brand: "Honda WB20",
    image: "/tools/water-pump.jpg",
    price: { amount: 1000, unit: "per day" },
    summary: "Move water from a river, dam or borehole to your plot.",
    description:
      "A 2-inch petrol pump for lifting water to a field or tank. Comes with 20 m of delivery hose and a suction hose with a strainer.",
    specs: [
      ["Flow", "600 litres per minute"],
      ["Lift", "Up to 26 m"],
      ["Includes", "20 m delivery hose"],
      ["Fuel", "Petrol, supplied by hirer"],
    ],
    seller: SELLERS.athiIrrigation,
    rating: 4.0,
    reviews: 6,
  },
  {
    id: "knapsack-sprayer-jacto",
    category: "sale",
    name: "Knapsack sprayer 16L",
    brand: "Jacto HD400",
    image: "/tools/knapsack-sprayer.jpg",
    price: { amount: 4200, unit: "each" },
    summary: "The standard sprayer for pesticide and foliar feed.",
    description:
      "A 16 litre lever-operated knapsack sprayer with brass nozzles and adjustable pressure. Spares are widely available, which matters more than the purchase price over a few seasons.",
    specs: [
      ["Capacity", "16 litres"],
      ["Nozzles", "Three included"],
      ["Warranty", "12 months"],
      ["Spares", "Available in stock"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.6,
    reviews: 43,
  },
  {
    id: "hand-hoe",
    category: "sale",
    name: "Hand hoe (jembe)",
    brand: "Forged steel",
    image: "/tools/hoe.jpg",
    price: { amount: 650, unit: "each" },
    summary: "Forged head on a hardwood handle.",
    description:
      "A standard weeding and digging hoe with a forged steel head and a seasoned hardwood handle. Heavier than the imported pressed-steel type and lasts considerably longer.",
    specs: [
      ["Head", "Forged steel"],
      ["Handle", "Hardwood, 90 cm"],
      ["Weight", "1.4 kg"],
      ["Bulk price", "KES 590 each from 10 units"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.3,
    reviews: 29,
  },
  {
    id: "wheelbarrow",
    category: "sale",
    name: "Heavy-duty wheelbarrow",
    brand: "Galvanised",
    image: "/tools/wheelbarrow.jpg",
    price: { amount: 5800, unit: "each" },
    summary: "For manure, harvest and water drums.",
    description:
      "A galvanised tray on a reinforced frame with a pneumatic wheel. The pneumatic wheel is what makes it usable on soft ground with a full load.",
    specs: [
      ["Capacity", "90 litres"],
      ["Wheel", "Pneumatic"],
      ["Frame", "Reinforced steel"],
      ["Warranty", "6 months"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.1,
    reviews: 15,
  },
  {
    id: "solar-pump-kit",
    category: "sale",
    name: "Solar irrigation pump kit",
    brand: "SunFarm 400W",
    image: "/tools/solar-pump.jpg",
    price: { amount: 78000, unit: "kit" },
    summary: "Pumps without fuel once it is installed.",
    description:
      "A 400 W solar panel array with a submersible DC pump and controller. There is no fuel cost after installation, which usually pays back against a petrol pump within two seasons of regular irrigation.",
    specs: [
      ["Panel", "400 W array"],
      ["Flow", "Up to 3,000 litres per hour"],
      ["Head", "Up to 30 m"],
      ["Warranty", "24 months on the pump"],
    ],
    seller: SELLERS.sunfarmSolar,
    rating: 4.5,
    reviews: 9,
  },
  {
    id: "spraying-service",
    category: "service",
    name: "Crop spraying service",
    brand: "Trained operator",
    image: "/tools/spraying.jpg",
    price: { amount: 1200, unit: "per acre" },
    summary: "A trained operator sprays for you, chemicals not included.",
    description:
      "A trained operator with protective equipment applies pesticide or foliar feed. Correct dosing and protective gear matter here - most spray damage comes from mixing too strong.",
    specs: [
      ["Includes", "Operator, sprayer, protective gear"],
      ["Excludes", "Chemicals"],
      ["Notice", "2 days"],
      ["Covers", "Up to 5 acres per day"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.4,
    reviews: 12,
  },
  {
    id: "transport-service",
    category: "service",
    name: "Produce transport",
    brand: "3 tonne lorry",
    image: "/tools/transport.jpg",
    price: { amount: 40, unit: "per km" },
    summary: "Move your harvest to the buyer or market.",
    description:
      "A 3 tonne lorry with a driver and loader for moving produce to a buyer or market. Priced per kilometre from your farm, with a minimum charge.",
    specs: [
      ["Capacity", "3 tonnes"],
      ["Includes", "Driver and one loader"],
      ["Minimum charge", "KES 2,500"],
      ["Notice", "1 day"],
    ],
    seller: SELLERS.kituiMachinery,
    rating: 4.2,
    reviews: 20,
  },
  {
    id: "shelling-service",
    category: "service",
    name: "Maize shelling at your farm",
    brand: "Operator brings the machine",
    image: "/tools/maize-sheller.jpg",
    price: { amount: 90, unit: "per bag" },
    summary: "They come to you, shell the maize and leave.",
    description:
      "The operator brings a petrol sheller to your homestead and charges per 90 kg bag produced. Cheaper than hiring the machine outright unless you have several tonnes, and there is nothing to transport or return.",
    specs: [
      ["Charged", "Per 90 kg bag shelled"],
      ["Output", "About 1 tonne per hour"],
      ["Includes", "Operator and fuel"],
      ["Notice", "1 day, longer at peak harvest"],
    ],
    seller: SELLERS.ukambaniSupplies,
    rating: 4.5,
    reviews: 26,
  },
];

export function getListing(id) {
  return listings.find((item) => item.id === id) || null;
}

export function formatPrice(price) {
  return `KES ${price.amount.toLocaleString()} ${price.unit}`;
}

export function searchListings(items, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) {
    return items;
  }

  return items.filter((item) =>
    [item.name, item.brand, item.summary, item.seller.name, item.seller.county]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  );
}
