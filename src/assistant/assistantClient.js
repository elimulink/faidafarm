// SSE streaming client, ported from ElimuLink's shared/chat/aiChatClient.js.
//
// The event contract is unchanged from ElimuLink, so the FastAPI endpoint can
// emit the same frames:
//   event: chunk   data: {"delta": "..."}
//   event: done    data: {"text": "...", "session_id": "..."}
//
// Until that endpoint exists, ASSISTANT_API_ENABLED is false and the panel
// streams from mockAssistantStream instead. Swapping over is a flag flip plus
// an env var, not a rewrite.

import { streamMockAssistantReply } from "./mockAssistantStream";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const ASSISTANT_PATH = "/api/v1/assistant/chat";

export const ASSISTANT_API_ENABLED = Boolean(import.meta.env.VITE_ASSISTANT_API);

function apiUrl(path) {
  return `${String(API_BASE).replace(/\/$/, "")}${path}`;
}

// Reads an SSE body frame by frame. Frames are separated by a blank line and
// may be split across reads, so the buffer is drained rather than assumed
// whole.
async function consumeEventStream(response, { onChunk, signal }) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let streamedText = "";
  let gotChunk = false;

  const processEvent = (eventBlock) => {
    const lines = eventBlock.split("\n");
    let eventType = "message";
    const dataLines = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line.slice(6).trim();
      }
      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    const payloadRaw = dataLines.join("\n");
    if (!payloadRaw) {
      return null;
    }

    let payload = {};
    try {
      payload = JSON.parse(payloadRaw);
    } catch {
      payload = {};
    }

    if (eventType === "chunk") {
      const delta = String(payload?.delta || "");
      if (delta) {
        gotChunk = true;
        streamedText += delta;
        onChunk?.(delta, streamedText);
      }
      return null;
    }

    if (eventType === "error") {
      return { done: true, error: String(payload?.message || "assistant_error") };
    }

    if (eventType === "done") {
      return {
        done: true,
        text: String(payload?.text || streamedText).trim(),
        conversationId: String(payload?.session_id || payload?.conversation_id || ""),
      };
    }

    return null;
  };

  try {
    while (true) {
      if (signal?.aborted) {
        return { ok: true, text: streamedText, aborted: true };
      }

      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      let sepIndex = buffer.search(/\r?\n\r?\n/);

      while (sepIndex >= 0) {
        const delimiter = buffer.slice(sepIndex).startsWith("\r\n\r\n") ? 4 : 2;
        const rawEvent = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + delimiter);

        const outcome = processEvent(rawEvent);
        if (outcome?.done) {
          return outcome.error
            ? { ok: false, reason: outcome.error, text: streamedText }
            : { ok: true, text: outcome.text, conversationId: outcome.conversationId };
        }

        sepIndex = buffer.search(/\r?\n\r?\n/);
      }
    }
  } catch {
    return {
      ok: false,
      reason: gotChunk ? "stream_interrupted" : "stream_failed",
      text: streamedText,
    };
  } finally {
    reader.releaseLock();
  }

  return gotChunk
    ? { ok: true, text: streamedText, conversationId: "" }
    : { ok: false, reason: "empty_stream", text: "" };
}

/**
 * Streams one assistant reply.
 *
 * @returns {Promise<{ok: boolean, text: string, reason?: string, aborted?: boolean}>}
 */
export async function streamAssistantReply({
  messages = [],
  context = null,
  token = "",
  onChunk = null,
  signal = null,
} = {}) {
  if (!ASSISTANT_API_ENABLED) {
    return streamMockAssistantReply({ messages, context, onChunk, signal });
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: false, reason: "offline", text: "" };
  }

  try {
    const response = await fetch(`${apiUrl(ASSISTANT_PATH)}?stream=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages, context }),
      signal,
    });

    const contentType = String(response.headers.get("content-type") || "");
    if (!response.ok || !response.body || !contentType.includes("text/event-stream")) {
      return { ok: false, reason: "no_stream", text: "" };
    }

    return await consumeEventStream(response, { onChunk, signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      return { ok: true, text: "", aborted: true };
    }
    return { ok: false, reason: "network_failed", text: "" };
  }
}

export const ASSISTANT_ERROR_MESSAGES = {
  offline: "You are offline. Your question is saved - ask again once you have a connection.",
  no_stream: "The assistant is not reachable right now. Please try again.",
  stream_failed: "The connection dropped before an answer arrived. Please try again.",
  stream_interrupted: "The answer was cut short by a connection problem.",
  empty_stream: "The assistant did not send an answer. Please try again.",
  network_failed: "Could not reach the assistant. Check your connection and try again.",
};

export function describeAssistantError(reason) {
  return ASSISTANT_ERROR_MESSAGES[reason] || ASSISTANT_ERROR_MESSAGES.no_stream;
}
