// Price over time: one series, one colour, real axes.
//
// Single series, so there is no legend - the title names it - and no
// categorical palette is involved. The latest point is direct-labelled rather
// than labelling every point, and tapping or hovering anywhere reveals a
// crosshair with that day's price.

import { useMemo, useRef, useState } from "react";

const LINE = "#166534";
const GRID = "#EDF1EB";
const AXIS_TEXT = "#8A958A";

const PAD = { top: 16, right: 14, bottom: 26, left: 38 };

function niceBounds(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const pad = Math.max(1, Math.round(span * 0.25));
  return { min: Math.floor((min - pad) / 2) * 2, max: Math.ceil((max + pad) / 2) * 2 };
}

function formatDay(date) {
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function PriceTrendChart({
  series = [],
  unit = "KES/kg",
  height = 190,
  label = "Price",
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const svgRef = useRef(null);

  // A fixed viewBox keeps the geometry simple; the SVG scales to its container.
  const width = 320;
  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const { points, ticks } = useMemo(() => {
    const prices = series.map((item) => item.price);
    const b = niceBounds(prices.length ? prices : [0, 1]);
    const step = series.length > 1 ? plotW / (series.length - 1) : 0;

    const mapped = series.map((item, index) => ({
      ...item,
      x: PAD.left + index * step,
      y:
        PAD.top +
        plotH -
        ((item.price - b.min) / Math.max(1, b.max - b.min)) * plotH,
    }));

    const tickCount = 3;
    const t = Array.from({ length: tickCount + 1 }, (_, i) => {
      const value = b.min + ((b.max - b.min) / tickCount) * i;
      return {
        value: Math.round(value),
        y: PAD.top + plotH - (i / tickCount) * plotH,
      };
    });

    return { points: mapped, ticks: t };
  }, [series, plotH, plotW]);

  if (!points.length) {
    return null;
  }

  const linePath = points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x} ${PAD.top + plotH} L${points[0].x} ${PAD.top + plotH} Z`;
  const last = points[points.length - 1];
  const prices = points.map((point) => point.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const active = activeIndex === null ? null : points[activeIndex];

  const onPointer = (event) => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const x = ratio * width;
    const index = Math.round(((x - PAD.left) / plotW) * (points.length - 1));
    setActiveIndex(Math.max(0, Math.min(points.length - 1, index)));
  };

  return (
    <figure className="m-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={`${label} over the last ${points.length} days, ending at ${last.price} ${unit}`}
        className="touch-none select-none"
        onPointerDown={onPointer}
        onPointerMove={(event) => {
          if (event.buttons || event.pointerType === "mouse") {
            onPointer(event);
          }
        }}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id="price-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LINE} stopOpacity="0.16" />
            <stop offset="100%" stopColor={LINE} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Recessive hairline grid, no dashes. */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke={GRID}
              strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={tick.y + 3.5}
              textAnchor="end"
              fontSize="9"
              fill={AXIS_TEXT}
            >
              {tick.value}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#price-area)" />
        <path
          d={linePath}
          fill="none"
          stroke={LINE}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Only the first, middle and last dates are labelled, so they never collide. */}
        {[0, Math.floor(points.length / 2), points.length - 1].map((index) => (
          <text
            key={index}
            x={points[index].x}
            y={height - 8}
            textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
            fontSize="9"
            fill={AXIS_TEXT}
          >
            {formatDay(points[index].date)}
          </text>
        ))}

        {active ? (
          <g>
            <line
              x1={active.x}
              x2={active.x}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke={LINE}
              strokeWidth="1"
              strokeOpacity="0.35"
            />
            <circle cx={active.x} cy={active.y} r="4.5" fill={LINE} stroke="#FFFFFF" strokeWidth="2" />
          </g>
        ) : (
          <>
            <circle cx={last.x} cy={last.y} r="4.5" fill={LINE} stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={last.x - 6}
              y={last.y - 8}
              textAnchor="end"
              fontSize="10.5"
              fontWeight="700"
              fill={LINE}
            >
              {last.price}
            </text>
          </>
        )}
      </svg>

      <figcaption className="mt-1 flex items-center justify-between text-xs text-[#8A958A]">
        <span>
          {active
            ? `${formatDay(active.date)} · KES ${active.price}/kg`
            : `Last ${points.length} days · ${unit}`}
        </span>
        <span>
          Low {low} · High {high}
        </span>
      </figcaption>
    </figure>
  );
}
