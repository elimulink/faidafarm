// Ambient motion behind the weather hero, matched to the current condition.
//
// Kept deliberately quiet: thin sparse rain, a slow cloud drift, a soft sun
// glow. The intent is a stock weather app, not a showpiece - the text on top
// has to stay the thing you read. All values are derived from the index rather
// than Math.random, so the pattern is stable across re-renders instead of
// reshuffling every time state changes.

import { useMemo } from "react";

// Cheap deterministic spread in [0, 1) - a hash, not randomness, so the same
// drop keeps the same lane and speed for the life of the component.
function spread(index, salt) {
  return ((Math.sin((index + 1) * salt) + 1) / 2) % 1;
}

const RAIN_DENSITY = {
  "Heavy rain": 26,
  Rain: 20,
  Showers: 16,
  "Light rain": 13,
  Drizzle: 10,
};

function Rain({ condition, windKph = 0 }) {
  const count = RAIN_DENSITY[condition] ?? 14;

  // Stronger wind leans the rain further; capped so it never looks cartoonish.
  const lean = Math.min(14, Math.round(windKph * 0.6));

  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const left = spread(index, 12.9898) * 100;
        const height = 12 + spread(index, 78.233) * 16;
        const duration = 0.85 + spread(index, 43.7585) * 0.75;
        const delay = spread(index, 93.9898) * 1.6;
        const opacity = 0.22 + spread(index, 21.4412) * 0.3;

        return { left, height, duration, delay, opacity };
      }),
    [count]
  );

  return (
    <>
      {drops.map((drop, index) => (
        <span
          key={index}
          className="weather-drop"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            transform: `rotate(${lean}deg)`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function Clouds() {
  const clouds = [
    { top: "-30%", left: "-10%", size: 260, duration: 26, delay: 0 },
    { top: "10%", left: "45%", size: 200, duration: 34, delay: 3 },
  ];

  return (
    <>
      {clouds.map((cloud, index) => (
        <span
          key={index}
          className="weather-cloud"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function Sun() {
  return (
    <span
      className="weather-sun"
      style={{ top: "-42%", right: "-18%", width: "230px", height: "230px" }}
    />
  );
}

const RAINY = new Set(["Heavy rain", "Rain", "Showers", "Light rain", "Drizzle"]);
const CLOUDY = new Set(["Cloudy", "Overcast"]);
const SUNNY = new Set(["Sunny", "Clear"]);

export default function WeatherBackdrop({ condition = "", windKph = 0 }) {
  return (
    <span className="weather-fx" aria-hidden="true">
      {RAINY.has(condition) ? (
        <>
          <Clouds />
          <Rain condition={condition} windKph={windKph} />
        </>
      ) : null}
      {CLOUDY.has(condition) ? <Clouds /> : null}
      {SUNNY.has(condition) ? <Sun /> : null}
    </span>
  );
}
