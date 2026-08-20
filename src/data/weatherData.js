// Weather for the farm.
//
// Sample data shaped like a forecast API response. The numbers deliberately
// agree with the weather alert (40-60 mm tomorrow) so the app never contradicts
// itself. Everything the page states as advice is DERIVED from these numbers by
// the functions below, so the words cannot drift from the forecast.

export const place = { name: "Kitui", county: "Kitui" };

export const current = {
  tempC: 24,
  feelsLikeC: 25,
  condition: "Light rain",
  humidity: 74,
  windKph: 11,
  windDir: "E",
  rainChance: 55,
  updatedAt: Date.now(),
  sunrise: "06:31",
  sunset: "18:36",
};

// Next 12 hours from the current hour.
const HOURLY_RAW = [
  { temp: 24, rain: 55, condition: "Light rain" },
  { temp: 23, rain: 60, condition: "Light rain" },
  { temp: 22, rain: 45, condition: "Cloudy" },
  { temp: 21, rain: 30, condition: "Cloudy" },
  { temp: 20, rain: 20, condition: "Cloudy" },
  { temp: 19, rain: 15, condition: "Clear" },
  { temp: 18, rain: 10, condition: "Clear" },
  { temp: 18, rain: 10, condition: "Clear" },
  { temp: 17, rain: 25, condition: "Cloudy" },
  { temp: 18, rain: 60, condition: "Light rain" },
  { temp: 19, rain: 80, condition: "Rain" },
  { temp: 20, rain: 85, condition: "Rain" },
];

export const hourly = HOURLY_RAW.map((entry, index) => {
  const at = new Date();
  at.setHours(at.getHours() + index, 0, 0, 0);
  return { ...entry, at };
});

// Seven days. Tomorrow is the heavy rain the alert warns about.
const DAILY_RAW = [
  { high: 25, low: 17, condition: "Light rain", rain: 55, rainfallMm: 8, windKph: 11, humidity: 74 },
  { high: 22, low: 16, condition: "Heavy rain", rain: 90, rainfallMm: 48, windKph: 18, humidity: 88 },
  { high: 24, low: 16, condition: "Showers", rain: 60, rainfallMm: 12, windKph: 14, humidity: 80 },
  { high: 27, low: 17, condition: "Cloudy", rain: 25, rainfallMm: 2, windKph: 10, humidity: 66 },
  { high: 29, low: 18, condition: "Sunny", rain: 10, rainfallMm: 0, windKph: 8, humidity: 52 },
  { high: 30, low: 19, condition: "Sunny", rain: 5, rainfallMm: 0, windKph: 9, humidity: 48 },
  { high: 29, low: 18, condition: "Sunny", rain: 10, rainfallMm: 0, windKph: 12, humidity: 50 },
];

export const daily = DAILY_RAW.map((entry, index) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + index);
  return { ...entry, date };
});

export const rainfallTotalMm = daily.reduce((total, day) => total + day.rainfallMm, 0);

export function dayLabel(date, index) {
  if (index === 0) {
    return "Today";
  }
  if (index === 1) {
    return "Tomorrow";
  }
  return date.toLocaleDateString([], { weekday: "short" });
}

// The farm advisories. Each one is a rule over the forecast numbers, so a page
// can never claim it is a good day to spray when the wind says otherwise.

function sprayAdvice({ current, hourly, daily }) {
  const window = hourly.slice(0, 6);
  const calm = window.every((hour) => hour.rain < 30);
  const windOk = current.windKph < 15;

  if (calm && windOk) {
    return {
      id: "spray",
      title: "Spraying",
      status: "good",
      verdict: "Good window now",
      detail: `Wind is ${current.windKph} km/h and no rain is expected for about six hours. Spray drifts above 15 km/h and washes off if rain follows within six hours.`,
    };
  }

  const nextDry = daily.findIndex((day, index) => index > 0 && day.rain <= 25);
  return {
    id: "spray",
    title: "Spraying",
    status: "avoid",
    verdict: "Not today",
    detail:
      current.windKph >= 15
        ? `Wind is ${current.windKph} km/h, above the 15 km/h where spray starts drifting off target.`
        : `Rain is likely within six hours and would wash the spray off.${
            nextDry > 0 ? ` ${dayLabel(daily[nextDry].date, nextDry)} looks better.` : ""
          }`,
  };
}

function dryingAdvice({ daily }) {
  const tomorrow = daily[1];
  const firstDry = daily.findIndex((day) => day.rainfallMm === 0 && day.humidity < 60);

  if (tomorrow.rainfallMm >= 20) {
    return {
      id: "drying",
      title: "Drying produce",
      status: "avoid",
      verdict: "Cover it tonight",
      detail: `${tomorrow.rainfallMm} mm is forecast for ${dayLabel(tomorrow.date, 1).toLowerCase()}. Wet grain grades lower and fetches less, so anything on a drying floor needs covering.${
        firstDry > 0 ? ` ${dayLabel(daily[firstDry].date, firstDry)} is the first good drying day.` : ""
      }`,
    };
  }

  return {
    id: "drying",
    title: "Drying produce",
    status: "good",
    verdict: "Safe to dry",
    detail: "No heavy rain in the next two days and humidity is falling.",
  };
}

function plantingAdvice({ daily }) {
  const comingRain = daily.slice(0, 3).reduce((total, day) => total + day.rainfallMm, 0);

  if (comingRain >= 30) {
    return {
      id: "planting",
      title: "Planting",
      status: "good",
      verdict: "Plant after the rain",
      detail: `${comingRain} mm over the next three days is enough to wet the soil profile. Plant once the ground is workable rather than into mud.`,
    };
  }

  return {
    id: "planting",
    title: "Planting",
    status: "watch",
    verdict: "Wait for rain",
    detail: `Only ${comingRain} mm expected in three days. Planting into dry soil risks losing the seed.`,
  };
}

function diseaseAdvice({ daily }) {
  const wetDays = daily.slice(0, 4).filter((day) => day.humidity >= 80).length;

  if (wetDays >= 2) {
    return {
      id: "disease",
      title: "Disease risk",
      status: "watch",
      verdict: "Raised",
      detail: `${wetDays} humid days ahead. Warm and wet favours fungal disease - check leaves for spots and mildew, especially on the lower canopy.`,
    };
  }

  return {
    id: "disease",
    title: "Disease risk",
    status: "good",
    verdict: "Low",
    detail: "Humidity stays moderate, so fungal pressure should be low this week.",
  };
}

// The sample forecast, for callers that have no live data yet.
export const sampleForecast = { current, hourly, daily, rainfallTotalMm };

export function getFarmAdvisories(data = sampleForecast) {
  if (!data?.current || !data?.hourly?.length || !data?.daily?.length) {
    return [];
  }
  return [sprayAdvice(data), dryingAdvice(data), plantingAdvice(data), diseaseAdvice(data)];
}

// The one line that belongs at the top of the page.
export function getHeadlineAdvice(data = sampleForecast) {
  const days = data?.daily || [];
  if (!days.length) {
    return "";
  }

  const heavy = days.findIndex((day) => day.rainfallMm >= 20);
  if (heavy >= 0) {
    return `${days[heavy].rainfallMm} mm of rain expected ${dayLabel(days[heavy].date, heavy).toLowerCase()}. Cover anything that is drying.`;
  }

  const total = data?.rainfallTotalMm ?? days.reduce((sum, day) => sum + (day.rainfallMm || 0), 0);
  return `${Math.round(total * 10) / 10} mm expected over the next seven days.`;
}
