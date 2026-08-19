// Local stand-in for the assistant backend.
//
// This exists so the panel is fully reviewable before /api/v1/assistant/chat
// is built. It answers from the same mock data the pages already render, and
// deliberately exercises the block renderer - tables, lists, headings, notes -
// so formatting problems show up now rather than after the backend lands.
//
// It is NOT a model. Replies are canned and matched by keyword.

import { MARKET_REFERENCE_PRICE, buyers, getMatchScore } from "../data/findBuyersData";
import { farmOverview, priceToday } from "../data/farmerDashboardData";
import { getPrimaryCropName } from "../farm/cropStorage";

const CHUNK_DELAY_MS = 18;
const THINKING_DELAY_MS = 420;

function topBuyers(count = 3) {
  return [...buyers].sort((a, b) => getMatchScore(b) - getMatchScore(a)).slice(0, count);
}

function buyerTable() {
  const rows = topBuyers()
    .map(
      (buyer) =>
        `| ${buyer.name} | KES ${buyer.offerPerKg}/kg | ${buyer.distanceKm} km | ${buyer.paymentTerms} |`
    )
    .join("\n");

  return `| Buyer | Offer | Distance | Payment |\n| --- | --- | --- | --- |\n${rows}`;
}

function sellAnswer() {
  const best = topBuyers(1)[0];

  return `## Hold for now

Your ${getPrimaryCropName(farmOverview.cropName)} is at ${farmOverview.stage.toLowerCase()} with harvest in ${farmOverview.harvestIn}. Today's price is **${priceToday.value}** and it is ${priceToday.trend.toLowerCase()} - ${priceToday.change}.

Selling before harvest means accepting today's price for a crop that is still gaining weight, so the recommendation is to wait.

**What to watch**

- Price movement over the next 7 days; if the rise flattens, sell
- ${best.name} is currently offering KES ${best.offerPerKg}/kg, ${Math.round(((best.offerPerKg - MARKET_REFERENCE_PRICE) / MARKET_REFERENCE_PRICE) * 100)}% above market
- Rain in the coming week, which affects drying and therefore grading

> Note: this is a demonstration reply from local data, not a live model.`;
}

function buyersAnswer() {
  return `## Best matches for your harvest

${buyerTable()}

**How to read this**

1. ${topBuyers(1)[0].name} scores highest overall on price, distance and track record
2. Higher offers often carry larger minimum volumes - check you can fill them
3. Payment terms matter as much as price if you need cash at harvest

Open **Find Buyers** to filter by crop, county or verified status.

> Note: this is a demonstration reply from local data, not a live model.`;
}

function priceAnswer() {
  return `Today's ${priceToday.crop} price is **${priceToday.value}**, ${priceToday.change}.

The market reference used across the app is KES ${MARKET_REFERENCE_PRICE}/kg, so current offers sit above it. The strongest offer on the platform right now is KES ${topBuyers(1)[0].offerPerKg}/kg.

> Note: this is a demonstration reply from local data, not a live model.`;
}

function weatherAnswer() {
  return `## Weather outlook

- **Tomorrow:** moderate rainfall expected in your area
- **Next week:** drying conditions, prepare irrigation for young crops

For ${getPrimaryCropName(farmOverview.cropName)} at ${farmOverview.stage.toLowerCase()}, rain now is helpful. The risk is rain arriving *during* drying after harvest, which lowers grade and therefore price.

> Note: this is a demonstration reply from local data, not a live model.`;
}

function fallbackAnswer(question) {
  return `I can help with your farm records, market prices, weather and finding buyers.

You asked: *${String(question || "").slice(0, 140)}*

Once the assistant backend is connected I will answer this from your live farm data. For now try one of these, which have demonstration replies wired up:

- Should I sell my ${getPrimaryCropName(farmOverview.cropName).toLowerCase()} now?
- Who are the best buyers near me?
- What is today's price?
- What is the weather doing this week?

> Note: this is a demonstration reply from local data, not a live model.`;
}

function photoAnswer(hasImage) {
  const subject = hasImage ? "photo" : "file";

  return `## I cannot read your ${subject} yet

Your ${subject} attached correctly - you can see it above the message - but looking
*inside* it needs the assistant backend, which is not connected yet.

Once it is, a photo of a leaf, pod or pest will be diagnosed here: what the problem
looks like, how far it has spread, and what to do about it this week.

**In the meantime, describe what you see** and I can still help:

- Which crop, and how old is it?
- Which part is affected - leaves, stem, pods or roots?
- Spots, holes, wilting, or discolouring?

> Note: this is a demonstration reply from local data, not a live model.`;
}

function pickAnswer(question, attachments = []) {
  if (attachments.length) {
    return photoAnswer(attachments.some((item) => item.isImage));
  }

  return pickTextAnswer(question);
}

function pickTextAnswer(question) {
  const text = String(question || "").toLowerCase();

  if (/\bsell|hold|wait|harvest\b/.test(text)) {
    return sellAnswer();
  }
  if (/\bbuyer|buyers|market trader|aggregator|who.*buy\b/.test(text)) {
    return buyersAnswer();
  }
  if (/\bprice|prices|kes|cost|worth\b/.test(text)) {
    return priceAnswer();
  }
  if (/\bweather|rain|dry|drought|forecast\b/.test(text)) {
    return weatherAnswer();
  }
  return fallbackAnswer(question);
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = window.setTimeout(() => {
      signal?.removeEventListener?.("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener?.("abort", onAbort, { once: true });
  });
}

// Streams a word at a time so the typing behaviour, caret and auto-scroll are
// exercised the same way a real token stream would exercise them.
export async function streamMockAssistantReply({
  messages = [],
  onChunk = null,
  signal = null,
} = {}) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const answer = pickAnswer(lastUserMessage?.text, lastUserMessage?.attachments || []);

  try {
    await wait(THINKING_DELAY_MS, signal);

    const pieces = answer.match(/\S+\s*/g) || [];
    let streamed = "";

    for (const piece of pieces) {
      await wait(CHUNK_DELAY_MS, signal);
      streamed += piece;
      onChunk?.(piece, streamed);
    }

    return { ok: true, text: streamed, conversationId: "mock" };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { ok: true, text: "", aborted: true };
    }
    return { ok: false, reason: "stream_failed", text: "" };
  }
}
