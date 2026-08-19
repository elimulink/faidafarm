// The crops a farmer can grow on FaidaFarm.
//
// `name` is what the farmer sees and what buyer records are matched against, so
// the names here must stay in step with the crops in findBuyersData. `aliases`
// exist because the same crop is commonly written two ways - ndengu and green
// grams are one crop, sukuma wiki and kale are another - and a farmer searching
// either word should find the same thing.

export const crops = [
  {
    id: "ndengu",
    name: "Ndengu",
    aliases: ["Green grams", "Mung beans"],
    category: "Pulses",
    image: "/crops/ndengu.jpg",
    seasonDays: 90,
  },
  {
    id: "maize",
    name: "Maize",
    aliases: ["Corn", "Mahindi"],
    category: "Cereals",
    image: "/crops/maize.jpg",
    seasonDays: 120,
  },
  {
    id: "beans",
    name: "Beans",
    aliases: ["Maharagwe", "Common beans"],
    category: "Pulses",
    image: "/crops/beans.jpg",
    seasonDays: 90,
  },
  {
    id: "cowpeas",
    name: "Cowpeas",
    aliases: ["Kunde"],
    category: "Pulses",
    image: "/crops/cowpeas.jpg",
    seasonDays: 80,
  },
  {
    id: "pigeon-peas",
    name: "Pigeon peas",
    aliases: ["Mbaazi"],
    category: "Pulses",
    image: "/crops/pigeon-peas.jpg",
    seasonDays: 150,
  },
  {
    id: "sorghum",
    name: "Sorghum",
    aliases: ["Mtama"],
    category: "Cereals",
    image: "/crops/sorghum.jpg",
    seasonDays: 110,
  },
  {
    id: "millet",
    name: "Millet",
    aliases: ["Wimbi", "Uwele"],
    category: "Cereals",
    image: "/crops/millet.jpg",
    seasonDays: 100,
  },
  {
    id: "french-beans",
    name: "French beans",
    aliases: ["Green beans", "Mishiri"],
    category: "Horticulture",
    image: "/crops/french-beans.jpg",
    seasonDays: 60,
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    aliases: ["Nyanya"],
    category: "Horticulture",
    image: "/crops/tomatoes.jpg",
    seasonDays: 75,
  },
  {
    id: "kale",
    name: "Kale",
    aliases: ["Sukuma wiki", "Collard greens"],
    category: "Horticulture",
    image: "/crops/kale.jpg",
    seasonDays: 45,
  },
  {
    id: "avocado",
    name: "Avocado",
    aliases: ["Parachichi"],
    category: "Fruit",
    image: "/crops/avocado.jpg",
    seasonDays: 365,
  },
];

export const cropCategories = [...new Set(crops.map((crop) => crop.category))];

const cropsById = new Map(crops.map((crop) => [crop.id, crop]));

export function getCrop(id) {
  return cropsById.get(id) || null;
}

export function getCrops(ids = []) {
  return ids.map((id) => cropsById.get(id)).filter(Boolean);
}

export function getCropNames(ids = []) {
  return getCrops(ids).map((crop) => crop.name);
}

// Matches a crop against a free-text name, so a buyer listed as "Green grams"
// still resolves to Ndengu.
export function findCropByName(value) {
  const needle = String(value || "").trim().toLowerCase();
  if (!needle) {
    return null;
  }

  return (
    crops.find((crop) => crop.name.toLowerCase() === needle) ||
    crops.find((crop) => crop.aliases.some((alias) => alias.toLowerCase() === needle)) ||
    null
  );
}

export function searchCrops(query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) {
    return crops;
  }

  return crops.filter((crop) =>
    [crop.name, crop.category, ...crop.aliases].some((value) =>
      value.toLowerCase().includes(needle)
    )
  );
}
