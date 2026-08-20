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
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.firebase_auth import FirebaseAuthService
from app.services.gemini import GeminiNotConfigured, stream_reply

logger = logging.getLogger(__name__)
router = APIRouter()

optional_bearer = HTTPBearer(auto_error=False)


class AssistantMessage(BaseModel):
    role: str = "user"
    text: str = ""


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
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(optional_bearer)] = None,
) -> StreamingResponse:
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
