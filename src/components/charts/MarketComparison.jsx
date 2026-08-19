// What each market pays, ranked.
//
// One measure across nominal categories, so every bar is the same colour and
// the best-paying one is emphasised - not a value-ramp, which would double
// encode length as hue. Every bar carries its value, so the comparison survives
// without reading the axis.

const BAR = "#2F8F46";
const BAR_BEST = "#166534";

export default function MarketComparison({ markets = [], unit = "KES/kg" }) {
  if (!markets.length) {
    return null;
  }

  const ranked = [...markets].sort((a, b) => b.price - a.price);
  const max = Math.max(...ranked.map((market) => market.price));
  const best = ranked[0];

  return (
    <ul className="space-y-3">
      {ranked.map((market) => {
        const isBest = market.id === best.id;
        return (
          <li key={market.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-semibold text-[#182118]">
                  {market.name}
                </span>
                {isBest ? (
                  <span className="shrink-0 rounded-full bg-[#F1F6EE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#166534]">
                    Best price
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-sm font-bold text-[#182118]">
                {market.price}
                <span className="ml-1 text-xs font-medium text-[#8A958A]">{unit}</span>
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F0F3EE]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(market.price / max) * 100}%`,
                    background: isBest ? BAR_BEST : BAR,
                  }}
                />
              </div>
              <span className="w-[86px] shrink-0 text-right text-xs text-[#8A958A]">
                {market.distanceKm} km · {market.demand}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
