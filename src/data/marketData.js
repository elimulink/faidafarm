// Market prices for the trend chart and market comparison.
//
// Sample data with the shape the backend will return: a dated series per crop
// plus current offers per market. Dates are generated relative to today so the
// chart always reads as "the last 30 days" rather than a frozen window.

import { produce, unitOf } from "./produceCatalogue";

const NDENGU_SERIES = [
  68, 67, 69, 70, 69, 71, 72, 71, 70, 69, 68, 70, 71, 73, 72,
  71, 70, 71, 72, 71, 71, 72, 74, 75, 76, 77, 76, 78, 79, 80,
];

function datedSeries(values) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return values.map((price, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (values.length - 1 - index));
    return { date, price };
  });
}

export const priceHistory = datedSeries(NDENGU_SERIES);

// The series above is ndengu. Showing it under a maize farmer's crop name was
// simply wrong - maize trades near 45/kg, not 80 - so the shape is reused but
// rescaled to whatever the crop actually fetches.
export function getPriceSeriesForCrop(cropName) {
  const item = produce.find(
    (entry) =>
      entry.name.toLowerCase() === String(cropName || "").toLowerCase() ||
      entry.aliases.some((alias) => alias.toLowerCase() === String(cropName || "").toLowerCase())
  );

  if (!item) {
    return { series: priceHistory, unit: "KES/kg", perUnit: "kg" };
  }

  const unit = unitOf(item);
  const [low, high] = item.farmGate;
  const base = NDENGU_SERIES;
  const baseLow = Math.min(...base);
  const baseHigh = Math.max(...base);
  const span = Math.max(1, baseHigh - baseLow);

  const scaled = base.map((value) =>
    Math.round(low + ((value - baseLow) / span) * (high - low))
  );

  return {
    series: datedSeries(scaled),
    unit: `KES/${unit.label}`,
    perUnit: unit.label,
  };
}

export const PRICE_UNIT = "KES/kg";

function pct(from, to) {
  return from ? ((to - from) / from) * 100 : 0;
}

// Stats the headline and the insight line are built from, so the numbers on the
// page and the numbers in the chart can never drift apart.
export function getPriceStats(series = priceHistory, windowDays = 7) {
  const points = series.slice(-windowDays);
  const prices = points.map((point) => point.price);
  const current = prices[prices.length - 1];
  const first = prices[0];

  return {
    current,
    low: Math.min(...prices),
    high: Math.max(...prices),
    changePct: Math.round(pct(first, current) * 10) / 10,
    windowDays,
    rising: current > first,
  };
}

// Kept in step with findBuyersData: the same market cannot pay 92 on one page
// and 86 on another.
export const markets = [
  { id: "nairobi", name: "Nairobi", price: 86, demand: "High", distanceKm: 172 },
  { id: "marikiti", name: "Marikiti", price: 85, demand: "High", distanceKm: 180 },
  { id: "machakos", name: "Machakos", price: 84, demand: "High", distanceKm: 96 },
  { id: "mwingi", name: "Mwingi", price: 83, demand: "High", distanceKm: 42 },
  { id: "kitui", name: "Kitui", price: 82, demand: "Medium", distanceKm: 8 },
];

// One sentence saying what the farmer should take from the numbers. Derived,
// not written, so it cannot contradict the chart.
export function getMarketInsight(stats = getPriceStats()) {
  const best = [...markets].sort((a, b) => b.price - a.price)[0];
  const nearest = [...markets].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  const gap = best.price - nearest.price;

  if (stats.rising) {
    return {
      tone: "hold",
      headline: "Waiting still looks better",
      detail:
        `Prices are up ${stats.changePct}% over ${stats.windowDays} days and have not flattened. ` +
        `${best.name} pays the most at KES ${best.price}/kg, KES ${gap} above ${nearest.name} ` +
        `which is only ${nearest.distanceKm} km away - check the extra earns back the transport.`,
    };
  }

  return {
    tone: "sell",
    headline: "Selling sooner looks better",
    detail:
      `Prices are down ${Math.abs(stats.changePct)}% over ${stats.windowDays} days. ` +
      `${best.name} still pays KES ${best.price}/kg.`,
  };
}
