# Weather from Open-Meteo.
#
# Chosen because it needs no API key and no signup, so nothing here can expire
# or run out of quota. Coverage over East Africa is good enough for the advisory
# use this app makes of it.
#
# Snapshots are persisted rather than proxied so the app still shows the last
# known weather when a farmer is offline, which is common in the field.

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.farmer import Farm, WeatherSnapshot
from app.models.user import User

logger = logging.getLogger(__name__)

# Open-Meteo returns a WMO code, not a description.
WMO_SUMMARIES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Light snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail",
}

# Refetching on every dashboard load would hammer the API and change nothing;
# Open-Meteo updates hourly.
FRESHNESS = timedelta(minutes=30)


def describe(code: Any) -> str:
    try:
        return WMO_SUMMARIES.get(int(code), "Unknown conditions")
    except (TypeError, ValueError):
        return "Unknown conditions"


async def fetch_current(latitude: float, longitude: float) -> dict[str, Any]:
    """One current-conditions reading. Raises on transport or HTTP failure."""
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code",
        "timezone": "auto",
        "wind_speed_unit": "kmh",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(settings.WEATHER_BASE_URL, params=params)
        response.raise_for_status()
        current = (response.json() or {}).get("current") or {}

    return {
        "temperature_c": current.get("temperature_2m"),
        "humidity_percent": current.get("relative_humidity_2m"),
        "rainfall_mm": current.get("precipitation"),
        "wind_speed_kph": current.get("wind_speed_10m"),
        "summary": describe(current.get("weather_code")),
    }


def _recent_snapshot(db: Session, user_id, farm_id) -> WeatherSnapshot | None:
    cutoff = datetime.now(timezone.utc) - FRESHNESS
    query = (
        select(WeatherSnapshot)
        .where(
            WeatherSnapshot.user_id == user_id,
            WeatherSnapshot.captured_at >= cutoff,
        )
        .order_by(WeatherSnapshot.captured_at.desc())
    )
    query = query.where(WeatherSnapshot.farm_id == farm_id) if farm_id else query.where(WeatherSnapshot.farm_id.is_(None))
    return db.scalars(query.limit(1)).first()


async def refresh_for_user(db: Session, user: User, farm: Farm | None = None) -> WeatherSnapshot | None:
    """Fetches and stores current weather for a farm, or the user's default point.

    Returns the existing row when one was taken recently, so callers can invoke
    this freely. Returns None if the upstream call fails and nothing is stored -
    weather is never important enough to fail a dashboard over.
    """
    cached = _recent_snapshot(db, user.id, farm.id if farm else None)
    if cached:
        return cached

    latitude = (farm.latitude if farm and farm.latitude is not None else settings.DEFAULT_LATITUDE)
    longitude = (farm.longitude if farm and farm.longitude is not None else settings.DEFAULT_LONGITUDE)

    try:
        reading = await fetch_current(latitude, longitude)
    except Exception:
        logger.exception("Weather fetch failed for %s,%s", latitude, longitude)
        return _recent_snapshot(db, user.id, farm.id if farm else None)

    snapshot = WeatherSnapshot(
        user_id=user.id,
        farm_id=farm.id if farm else None,
        county=(farm.county if farm else None),
        captured_at=datetime.now(timezone.utc),
        **reading,
    )
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)
    return snapshot
