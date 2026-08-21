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

Farmers will send photos of leaves, stems, soil, pests and stored grain. You
can see them. Look at what is actually in the picture and say what you observe
before you interpret it, so the farmer can tell whether you are looking at the
same thing they are. If the photo is too blurred or too dark to judge, say so
and ask for a closer one in daylight rather than guessing at a diagnosis.

If a question needs information you do not have - the farmer's county, crop, or
plot size - ask one short clarifying question instead of guessing.

Stay within farming, livestock, weather, soil, pests, storage, and selling
produce. If asked about something else, say briefly that you focus on farming
and offer to help with a farming question instead. Never invent prices, subsidy
programmes, or agrochemical dosages: say what you are unsure of and suggest
checking with a local agrovet or extension officer."""


class GeminiNotConfigured(RuntimeError):
    """Raised when no API key is present."""


class GeminiBusy(RuntimeError):
    """Every model was rate limited. Distinct from a fault: retrying works."""


def _models() -> list[str]:
    """Primary first, then the fallback, skipping a duplicate."""
    models = [settings.GEMINI_MODEL]
    fallback = settings.GEMINI_FALLBACK_MODEL
    if fallback and fallback != settings.GEMINI_MODEL:
        models.append(fallback)
    return models


def _payload(contents: list[dict[str, Any]], context: dict[str, Any] | None) -> dict[str, Any]:
    return {
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


# A photo of a leaf is often a better question than any description of it, so
# the cap is generous enough for several shots of one plant.
MAX_IMAGES_PER_TURN = 4


def _to_contents(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Maps the client's {role, text, images} history onto Gemini's contents.

    The dock uses "assistant"; Gemini calls the same thing "model". Empty turns
    are dropped - the client appends a blank assistant message as a placeholder
    before streaming into it, and sending that would end the history on an empty
    model turn. A turn carrying only a photo is NOT empty: "what is wrong with
    this?" is the whole question a farmer means by sending it.
    """
    contents: list[dict[str, Any]] = []

    for message in messages:
        text = str(message.get("text") or message.get("content") or "").strip()
        images = (message.get("images") or [])[:MAX_IMAGES_PER_TURN]

        if not text and not images:
            continue

        parts: list[dict[str, Any]] = []
        if text:
            parts.append({"text": text})

        for image in images:
            data = str(image.get("data") or "")
            if not data:
                continue
            parts.append(
                {
                    "inlineData": {
                        "mimeType": str(image.get("mimeType") or "image/jpeg"),
                        "data": data,
                    }
                }
            )

        # A photo with no words needs a question attached, or the model tends to
        # narrate the picture rather than diagnose it.
        if images and not text:
            parts.insert(0, {"text": "What do you see in this photo of my crop, and what should I do?"})

        role = "model" if message.get("role") in {"assistant", "model"} else "user"
        contents.append({"role": role, "parts": parts})

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
    """Yields reply text deltas as Gemini produces them.

    Tries each model in turn while the response is still just headers, so a rate
    limited primary costs nothing but a moment - once bytes have been yielded a
    switch is impossible, which is why the status is checked before iterating.
    """
    if not settings.GEMINI_API_KEY:
        raise GeminiNotConfigured("GEMINI_API_KEY is not set.")

    contents = _to_contents(messages)
    if not contents:
        return

    payload = _payload(contents, context)
    timeout = httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        for index, model in enumerate(_models()):
            url = f"{settings.GEMINI_BASE_URL}/models/{model}:streamGenerateContent"
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
                if response.status_code == 429:
                    await response.aread()
                    logger.warning("%s is rate limited", model)
                    if index + 1 < len(_models()):
                        continue
                    raise GeminiBusy("Every model is rate limited.")

                if response.status_code != 200:
                    body = (await response.aread()).decode("utf-8", "replace")[:500]
                    logger.error("Gemini %s returned %s: %s", model, response.status_code, body)
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
                return


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

    payload = _payload(contents, context)
    models = _models()

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as client:
        for index, model in enumerate(models):
            response = await client.post(
                f"{settings.GEMINI_BASE_URL}/models/{model}:generateContent",
                headers={
                    "x-goog-api-key": settings.GEMINI_API_KEY,
                    "Content-Type": "application/json",
                },
                json=payload,
            )

            if response.status_code == 429:
                logger.warning("%s is rate limited", model)
                if index + 1 < len(models):
                    continue
                raise GeminiBusy("Every model is rate limited.")

            response.raise_for_status()
            data = response.json() or {}
            candidates = data.get("candidates") or []
            if not candidates:
                return ""
            parts = (candidates[0].get("content") or {}).get("parts") or []
            return "".join(part.get("text", "") for part in parts).strip()

    return ""
