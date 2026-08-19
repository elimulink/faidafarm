// Market prices for the trend chart and market comparison.
//
// Sample data with the shape the backend will return: a dated series per crop
// plus current offers per market. Dates are generated relative to today so the
// chart always reads as "the last 30 days" rather than a frozen window.

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

export const markets = [
  { id: "nairobi", name: "Nairobi", price: 92, demand: "High", distanceKm: 172 },
  { id: "machakos", name: "Machakos", price: 90, demand: "High", distanceKm: 96 },
  { id: "kitui", name: "Kitui", price: 88, demand: "Medium", distanceKm: 8 },
  { id: "mwingi", name: "Mwingi", price: 85, demand: "High", distanceKm: 42 },
  { id: "kibwezi", name: "Kibwezi", price: 83, demand: "Low", distanceKm: 74 },
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
