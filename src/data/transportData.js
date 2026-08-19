// What it actually costs to get produce to a buyer.
//
// Every figure here is an assumption a farmer can check and correct, which is
// the point: a farmer shown only a final number cannot tell when we are wrong.
// The model is deliberately simple and transparent - fuel for the round trip,
// a margin covering maintenance and the owner's profit, and a driver's day.
//
// Calibrated against known hire prices out of Kitui, Machakos and Bungoma to
// Nairobi. Adjust FUEL_PRICE_KES first when things drift; it moves everything.

export const FUEL_PRICE_KES = 170;
export const BAG_KG = 90;

// Offloading at the market is charged per bag, and varies by market and by how
// far the bags are carried.
export const OFFLOAD_PER_BAG_KES = 70;

// County produce cess. Who pays it depends on the arrangement with the buyer,
// so it is shown separately rather than buried in a total.
export const CESS_PER_BAG_KES = 20;

// Sending sacks on transport that is already going - a lorry with space, or a
// matatu parcel service. This is how a smallholder with a few gunias actually
// moves produce, and it is far cheaper per kilo than hiring a vehicle, because
// the trip is happening anyway.
//
// Calibrated on a real quote: KES 500 for one 90 kg gunia, Mombasa to Salama,
// roughly 400 km. That works out near KES 1.40 per kg per 100 km. Rates are
// negotiated and vary a lot - a route with heavy traffic and empty return legs
// is cheaper than one off the main road - so this is a starting figure the
// farmer should correct, not a quote.
export const SHARED_RATE_PER_KG_PER_100KM = 1.4;
export const SHARED_MIN_PER_BAG_KES = 100;

export function estimateSharedTransport({ distanceKm = 0, quantityKg = 0 }) {
  if (!distanceKm || !quantityKg) {
    return { perKgKes: 0, totalKes: 0, bags: 0, perBagKes: 0 };
  }

  const bags = Math.max(1, Math.ceil(quantityKg / BAG_KG));
  const perBag = Math.max(
    SHARED_MIN_PER_BAG_KES,
    (SHARED_RATE_PER_KG_PER_100KM * distanceKm * BAG_KG) / 100
  );
  const totalKes = perBag * bags;

  return {
    bags,
    perBagKes: Math.round(perBag),
    totalKes: Math.round(totalKes),
    perKgKes: totalKes / quantityKg,
  };
}

const VEHICLES = [
  { id: "pickup", label: "Pickup", capacityKg: 1000, kmPerLitre: 10, driverKes: 1500 },
  { id: "canter", label: "3t canter", capacityKg: 3000, kmPerLitre: 7, driverKes: 2500 },
  { id: "lorry7", label: "7t lorry", capacityKg: 7000, kmPerLitre: 4.5, driverKes: 3500 },
  { id: "lorry10", label: "10t lorry", capacityKg: 10000, kmPerLitre: 4, driverKes: 4000 },
];

// Fuel is only part of a hire price; the rest is maintenance, tyres, insurance
// and the owner's margin.
const OWNER_MARGIN = 1.8;

export function pickVehicle(quantityKg) {
  return (
    VEHICLES.find((vehicle) => quantityKg <= vehicle.capacityKg) || VEHICLES[VEHICLES.length - 1]
  );
}

/**
 * Estimates one delivery trip.
 *
 * The lorry has to come back whether or not it carries anything, so the round
 * trip is what gets paid for - the single most common mistake in working this
 * out.
 */
export function estimateTrip({ distanceKm = 0, quantityKg = 0 }) {
  if (!distanceKm || !quantityKg) {
    return { hireKes: 0, perKgKes: 0, vehicle: null, trips: 0, roundTripKm: 0, fuelKes: 0 };
  }

  const vehicle = pickVehicle(quantityKg);
  const trips = Math.max(1, Math.ceil(quantityKg / vehicle.capacityKg));
  const roundTripKm = distanceKm * 2;

  const litres = roundTripKm / vehicle.kmPerLitre;
  const fuelKes = litres * FUEL_PRICE_KES;

  // Over about 250 km one way the driver cannot get back the same day.
  const days = distanceKm > 250 ? 2 : 1;
  const hirePerTrip = fuelKes * OWNER_MARGIN + vehicle.driverKes * days;
  const hireKes = hirePerTrip * trips;

  return {
    vehicle,
    trips,
    roundTripKm,
    fuelKes: Math.round(fuelKes * trips),
    hireKes: Math.round(hireKes),
    perKgKes: hireKes / quantityKg,
  };
}

/**
 * What the farmer actually keeps per kilo after getting the produce there.
 *
 * A buyer who collects costs the farmer nothing to reach, which is usually why
 * a lower farm-gate offer still wins.
 */
export function estimateNet({ buyer, quantityKg = 0 }) {
  const bags = Math.max(1, Math.ceil(quantityKg / BAG_KG));
  const farmerDelivers = buyer.transport !== "Buyer collects";

  const trip = farmerDelivers
    ? estimateTrip({ distanceKm: buyer.distanceKm, quantityKg })
    : estimateTrip({ distanceKm: 0, quantityKg: 0 });

  const shared = farmerDelivers
    ? estimateSharedTransport({ distanceKm: buyer.distanceKm, quantityKg })
    : estimateSharedTransport({ distanceKm: 0, quantityKg: 0 });

  // Whichever the farmer would really do: send the sacks on transport that is
  // already going, or hire a vehicle once the load justifies it.
  const useShared = farmerDelivers && shared.perKgKes > 0 && shared.perKgKes < trip.perKgKes;
  const transportPerKg = farmerDelivers ? (useShared ? shared.perKgKes : trip.perKgKes) : 0;
  const offloadPerKg = farmerDelivers ? (bags * OFFLOAD_PER_BAG_KES) / Math.max(1, quantityKg) : 0;
  const cessPerKg = farmerDelivers ? (bags * CESS_PER_BAG_KES) / Math.max(1, quantityKg) : 0;

  const deductionsPerKg = transportPerKg + offloadPerKg + cessPerKg;
  const netPerKg = buyer.offerPerKg - deductionsPerKg;

  return {
    farmerDelivers,
    trip,
    shared,
    useShared,
    mode: !farmerDelivers ? "collected" : useShared ? "shared" : "hired",
    bags,
    transportPerKg,
    offloadPerKg,
    cessPerKg,
    deductionsPerKg,
    netPerKg,
    grossKes: Math.round(buyer.offerPerKg * quantityKg),
    netKes: Math.round(netPerKg * quantityKg),
  };
}

/**
 * The load at which delivering to `buyer` finally beats the best local offer.
 * Returns null when it never does, which at a narrow price gap is the usual
 * answer and the one worth saying out loud.
 */
export function breakEvenKg({ buyer, localNetPerKg }) {
  const gap = buyer.offerPerKg - localNetPerKg;
  if (gap <= 0) {
    return null;
  }

  // Deductions per kilo fall as the load grows, so this is solved by walking up
  // through realistic loads rather than with a single formula.
  for (let kg = 250; kg <= 30000; kg += 250) {
    if (estimateNet({ buyer, quantityKg: kg }).netPerKg > localNetPerKg) {
      return kg;
    }
  }

  return null;
}
