// What the first-run tour points at, and whether it has been seen.
//
// The order follows what a farmer needs in the order they need it: today's
// decision first, then where the numbers behind it live, then the two things
// they would otherwise never discover - alerts arriving on the phone, and the
// assistant answering questions about a photograph.

const SEEN_KEY = "faidafarm.tour.seen.v1";

export const FARMER_TOUR_STEPS = [
  {
    target: '[data-tour="advice"]',
    title: "Today's decision",
    body: "Hold or sell, worked out from this week's prices for the crop you grow. It always says why.",
  },
  {
    target: '[data-tour="market-intelligence"]',
    title: "The numbers behind it",
    body: "Compare what different markets are paying, and see the farm gate price beside the market price.",
  },
  {
    target: '[data-tour="alerts"]',
    title: "Warnings reach your phone",
    body: "Heavy rain, a sharp price move, harvest coming up. These arrive as notifications so you hear in time to act.",
  },
  {
    target: '[data-tour="assistant"]',
    title: "Ask about your crop",
    body: "Photograph a leaf or a pest and ask. It answers in plain language, already knowing your crop and county.",
  },
  {
    target: '[data-tour="my-farm"]',
    title: "Keep it current",
    body: "Add or change your crops here. Everything else follows from what you have in the ground.",
  },
];

/** True when this person has not been shown the tour yet.
 *
 *  Storage can throw in a locked-down WebView, and a tour is never worth
 *  breaking the dashboard over - so an unreadable store means "already seen".
 */
export function shouldShowTour() {
  try {
    return !window.localStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

export function markTourSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, new Date().toISOString());
  } catch {
    // Nothing to do; it will simply offer again next time.
  }
}

/** Lets someone replay it from Settings, and makes it testable by hand. */
export function resetTour() {
  try {
    window.localStorage.removeItem(SEEN_KEY);
  } catch {
    // Ignored for the same reason as above.
  }
}
