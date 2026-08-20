# The farmer assistant endpoint.
#
# Emits the frame contract src/assistant/assistantClient.js already parses:
#   event: chunk   data: {"delta": "..."}
#   event: done    data: {"text": "...", "session_id": "..."}
#   event: error   data: {"message": "..."}
#
# Auth is optional on purpose. The dock is reachable from public screens, and a
# farmer who has not signed in should still be able to ask a question; when a
# token is present it is verified and the answer is tailored to that user.

import json
import logging
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field, field_validator

from app.core.config import settings
from app.services.firebase_auth import FirebaseAuthService
from app.services.gemini import GeminiBusy, GeminiNotConfigured, generate_reply, stream_reply

logger = logging.getLogger(__name__)
router = APIRouter()

optional_bearer = HTTPBearer(auto_error=False)


class AssistantMessage(BaseModel):
    role: str = "user"
    text: str = ""

    # A stored message can carry text: null - an attachment-only turn, or one
    # restored from an older chat. Rejecting the whole request over it meant the
    # farmer saw "Could not reach the assistant" with nothing wrong at all, so a
    # null is read as the empty string it means.
    @field_validator("role", "text", mode="before")
    @classmethod
    def _null_is_empty(cls, value: Any) -> Any:
        return "" if value is None else value


class AssistantChatRequest(BaseModel):
    messages: list[AssistantMessage] = Field(default_factory=list)
    context: dict[str, Any] | None = None


def _frame(event: str, payload: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"


async def _identify(credentials: HTTPAuthorizationCredentials | None) -> dict | None:
    """Best-effort identity. A bad token must not break an anonymous question."""
    if credentials is None or not credentials.credentials:
        return None
    try:
        return await FirebaseAuthService.verify_id_token(credentials.credentials)
    except HTTPException:
        return None


@router.post("/chat")
async def chat(
    payload: AssistantChatRequest,
    request: Request,
    stream: bool = True,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(optional_bearer)] = None,
):
    if not settings.assistant_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The assistant is not configured.",
        )

    if not payload.messages:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one message is required.",
        )

    decoded = await _identify(credentials)
    context = dict(payload.context or {})
    if decoded and decoded.get("name"):
        context.setdefault("farmerName", decoded["name"])

    session_id = str(uuid.uuid4())
    messages = [message.model_dump() for message in payload.messages]

    # Plain JSON when the caller did not ask for a stream, or cannot accept one.
    # A WebView on a weak connection often cannot hold an SSE body open, and an
    # answer that arrives late in one piece beats a stream that dies halfway.
    wants_stream = stream and "text/event-stream" in request.headers.get("accept", "")
    if not wants_stream:
        try:
            text = await generate_reply(messages, context)
        except GeminiNotConfigured:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="The assistant is not configured.",
            ) from None
        except GeminiBusy:
            # Distinct from a fault: the same question works a moment later, and
            # the farmer should be told to wait rather than to check a
            # connection that is fine.
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="The assistant is busy. Try again in a moment.",
            ) from None
        except Exception as exc:
            logger.exception("Assistant reply failed")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The assistant could not answer just now.",
            ) from exc

        return {"text": text, "session_id": session_id}

    async def event_stream():
        collected: list[str] = []
        try:
            async for delta in stream_reply(messages, context):
                # The browser closing the tab should stop us billing tokens.
                if await request.is_disconnected():
                    logger.info("Assistant client disconnected; stopping stream")
                    return
                collected.append(delta)
                yield _frame("chunk", {"delta": delta})
        except GeminiNotConfigured:
            yield _frame("error", {"message": "assistant_not_configured"})
            return
        except GeminiBusy:
            yield _frame("error", {"message": "assistant_busy"})
            return
        except Exception:
            logger.exception("Assistant stream failed")
            # A partial answer is still worth delivering, so send what we have.
            yield _frame("error", {"message": "assistant_error"})
            return

        yield _frame("done", {"text": "".join(collected), "session_id": session_id})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            # Render sits behind a proxy that will otherwise buffer the stream
            # and deliver it as one lump at the end.
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/status")
def assistant_status() -> dict[str, Any]:
    return {
        "enabled": settings.assistant_enabled,
        "model": settings.GEMINI_MODEL if settings.assistant_enabled else None,
    }
