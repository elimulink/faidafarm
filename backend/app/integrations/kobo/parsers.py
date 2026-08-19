from typing import Any


def get_submission_id(payload: dict[str, Any]) -> str:
    return str(payload.get("_id") or payload.get("_uuid") or payload.get("uuid") or "")


def parse_household(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "external_id": payload.get("household_id") or payload.get("external_id"),
        "county": payload.get("county") or payload.get("County") or "Unknown",
        "sub_county": payload.get("sub_county") or payload.get("subcounty"),
        "ward": payload.get("ward"),
        "village": payload.get("village"),
        "head_name": payload.get("head_name") or payload.get("household_head"),
        "phone": payload.get("phone"),
        "latitude": payload.get("_geolocation", [None, None])[0] if payload.get("_geolocation") else payload.get("latitude"),
        "longitude": payload.get("_geolocation", [None, None])[1] if payload.get("_geolocation") else payload.get("longitude"),
        "source": "kobo",
    }
