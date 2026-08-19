// Seven-day high and low temperature.
//
// Two series on ONE shared axis - both are degrees, so a second scale would be
// meaningless and misleading. Each point is direct-labelled the way a weather
// app does it, and a legend names the two lines so identity never rests on
// colour alone. The pair (#C2542F warm / #3A6EA5 cool) passes the CVD and
// contrast checks.

const HIGH = "#C2542F";
const LOW = "#3A6EA5";
const AXIS_TEXT = "#8A958A";

export default function TempRangeChart({ days = [], labelFor, height = 168 }) {
  if (!days.length) {
    return null;
  }

  const width = 340;
  const pad = { top: 22, right: 16, bottom: 26, left: 16 };
  const plotH = height - pad.top - pad.bottom;
  const plotW = width - pad.left - pad.right;

  const temps = days.flatMap((day) => [day.high, day.low]);
  const min = Math.min(...temps) - 2;
  const max = Math.max(...temps) + 2;
  const step = days.length > 1 ? plotW / (days.length - 1) : 0;

  const project = (value, index) => ({
    x: pad.left + index * step,
    y: pad.top + plotH - ((value - min) / Math.max(1, max - min)) * plotH,
  });

  const highPoints = days.map((day, index) => project(day.high, index));
  const lowPoints = days.map((day, index) => project(day.low, index));
  const toPath = (points) => points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

  return (
    <figure className="m-0">
      <div className="mb-1.5 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C574D]">
          <span className="h-2 w-2 rounded-full" style={{ background: HIGH }} />
          High
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C574D]">
          <span className="h-2 w-2 rounded-full" style={{ background: LOW }} />
          Low
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={`Seven day forecast, highs ${Math.max(...days.map((d) => d.high))} to ${Math.min(
          ...days.map((d) => d.high)
        )} degrees and lows ${Math.max(...days.map((d) => d.low))} to ${Math.min(
          ...days.map((d) => d.low)
        )} degrees`}
      >
        <path d={toPath(highPoints)} fill="none" stroke={HIGH} strokeWidth="2" strokeLinecap="round" />
        <path d={toPath(lowPoints)} fill="none" stroke={LOW} strokeWidth="2" strokeLinecap="round" />

        {days.map((day, index) => (
          <g key={index}>
            <circle cx={highPoints[index].x} cy={highPoints[index].y} r="3.5" fill={HIGH} />
            <text
              x={highPoints[index].x}
              y={highPoints[index].y - 8}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={HIGH}
            >
              {day.high}&deg;
            </text>

            <circle cx={lowPoints[index].x} cy={lowPoints[index].y} r="3.5" fill={LOW} />
            <text
              x={lowPoints[index].x}
              y={lowPoints[index].y + 15}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={LOW}
            >
              {day.low}&deg;
            </text>

            <text
              x={highPoints[index].x}
              y={height - 7}
              textAnchor="middle"
              fontSize="9.5"
              fill={AXIS_TEXT}
            >
              {labelFor ? labelFor(day, index) : index}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
