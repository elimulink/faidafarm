# Gemini client for the farmer assistant.
#
# Only streaming is exposed. The dock shows words as they arrive, and a farmer on
# a slow connection should see progress rather than a spinner, so the non-stream
# call is deliberately absent.
#
# Gemini's own SSE frames are not the frames the browser expects - the client
# speaks the ElimuLink contract (event: chunk / event: done). Translating happens
# in the route; this module yields plain text deltas.

import json
import logging
from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = """You are the FaidaFarm assistant, helping smallholder farmers in Kenya.

Answer in plain, practical language a farmer can act on today. Prefer short
paragraphs and short lists. Use metric units, Kenyan Shillings (KES), and local
season names (long rains, short rains) where they apply.

If a question needs information you do not have - the farmer's county, crop, or
plot size - ask one short clarifying question instead of guessing.

Stay within farming, livestock, weather, soil, pests, storage, and selling
produce. If asked about something else, say briefly that you focus on farming
and offer to help with a farming question instead. Never invent prices, subsidy
programmes, or agrochemical dosages: say what you are unsure of and suggest
checking with a local agrovet or extension officer."""


class GeminiNotConfigured(RuntimeError):
    """Raised when no API key is present."""


def _to_contents(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Maps the client's {role, text} history onto Gemini's contents array.

    The dock uses "assistant"; Gemini calls the same thing "model". Empty turns
    are dropped - the client appends a blank assistant message as a placeholder
    before streaming into it, and sending that would end the history on an empty
    model turn.
    """
    contents: list[dict[str, Any]] = []
    for message in messages:
        text = str(message.get("text") or message.get("content") or "").strip()
        if not text:
            continue
        role = "model" if message.get("role") in {"assistant", "model"} else "user"
        contents.append({"role": role, "parts": [{"text": text}]})
    return contents


def _system_instruction(context: dict[str, Any] | None) -> dict[str, Any]:
    text = SYSTEM_INSTRUCTION
    if context:
        where = str(context.get("pageLabel") or context.get("page") or "").strip()
        if where:
            text += f"\n\nThe farmer is currently on the {where} screen of the app."
        county = str(context.get("county") or "").strip()
        if county:
            text += f"\nTheir county is {county}."
    return {"parts": [{"text": text}]}


async def stream_reply(
    messages: list[dict[str, Any]],
    context: dict[str, Any] | None = None,
) -> AsyncIterator[str]:
    """Yields reply text deltas as Gemini produces them."""
    if not settings.GEMINI_API_KEY:
        raise GeminiNotConfigured("GEMINI_API_KEY is not set.")

    contents = _to_contents(messages)
    if not contents:
        return

    url = f"{settings.GEMINI_BASE_URL}/models/{settings.GEMINI_MODEL}:streamGenerateContent"
    payload = {
        "contents": contents,
        "systemInstruction": _system_instruction(context),
        "generationConfig": {
            "maxOutputTokens": settings.ASSISTANT_MAX_OUTPUT_TOKENS,
            "temperature": 0.7,
            # Thinking costs seconds and tokens the farmer never sees. These are
            # short advisory answers, so it is turned off.
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    timeout = httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream(
            "POST",
            url,
            params={"alt": "sse"},
            headers={
                "x-goog-api-key": settings.GEMINI_API_KEY,
                "Content-Type": "application/json",
            },
            json=payload,
        ) as response:
            if response.status_code != 200:
                body = (await response.aread()).decode("utf-8", "replace")[:500]
                logger.error("Gemini returned %s: %s", response.status_code, body)
                raise httpx.HTTPStatusError(
                    f"Gemini returned {response.status_code}",
                    request=response.request,
                    response=response,
                )

            async for line in response.aiter_lines():
                if not line.startswith("data:"):
                    continue
                raw = line[5:].strip()
                if not raw or raw == "[DONE]":
                    continue
                try:
                    frame = json.loads(raw)
                except json.JSONDecodeError:
                    logger.warning("Skipping unparseable Gemini frame")
                    continue

                for candidate in frame.get("candidates") or []:
                    for part in (candidate.get("content") or {}).get("parts") or []:
                        delta = part.get("text")
                        if delta:
                            yield delta


async def generate_reply(
    messages: list[dict[str, Any]],
    context: dict[str, Any] | None = None,
) -> str:
    """One request, one complete answer.

    The streaming path is nicer when it works, but SSE has to survive Render's
    proxy, Cloudflare and a WebView on a 3G handset, and any one of those can
    buffer or drop it. This is the same plain request/response ElimuLink uses,
    kept as the fallback so a farmer gets an answer even when the stream cannot
    be held open.
    """
    if not settings.GEMINI_API_KEY:
        raise GeminiNotConfigured("GEMINI_API_KEY is not set.")

    contents = _to_contents(messages)
    if not contents:
        return ""

    url = f"{settings.GEMINI_BASE_URL}/models/{settings.GEMINI_MODEL}:generateContent"
    payload = {
        "contents": contents,
        "systemInstruction": _system_instruction(context),
        "generationConfig": {
            "maxOutputTokens": settings.ASSISTANT_MAX_OUTPUT_TOKENS,
            "temperature": 0.7,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as client:
        response = await client.post(
            url,
            headers={
                "x-goog-api-key": settings.GEMINI_API_KEY,
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json() or {}

    candidates = data.get("candidates") or []
    if not candidates:
        return ""

    parts = (candidates[0].get("content") or {}).get("parts") or []
    return "".join(part.get("text", "") for part in parts).strip()
