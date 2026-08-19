// Message rendering, following ElimuLink's Bubble: the farmer's own message sits
// in a tinted right-aligned bubble, the assistant's answer is unboxed prose with
// an action row underneath.

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Ellipsis, FileText, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import ResponseBlocks from "./ResponseBlocks";

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1.5 py-1" aria-label="Assistant is typing">
      <span className="assistant-typing-dot" />
      <span className="assistant-typing-dot assistant-typing-dot-delay-1" />
      <span className="assistant-typing-dot assistant-typing-dot-delay-2" />
    </div>
  );
}

// A reloaded conversation keeps the attachment's name but not its blob URL,
// so the thumbnail falls back to a labelled chip rather than a broken image.
function SentAttachments({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-2 flex flex-wrap justify-end gap-2">
      {items.map((item) =>
        item.isImage && item.url ? (
          <img
            key={item.id}
            src={item.url}
            alt={item.name}
            className="h-28 w-28 rounded-2xl border border-[#DCEAD5] object-cover"
          />
        ) : (
          <span
            key={item.id}
            className="inline-flex max-w-[190px] items-center gap-2 rounded-2xl border border-[#DCEAD5] bg-white px-2.5 py-2"
          >
            <FileText size={15} className="shrink-0 text-[#2F8F46]" />
            <span className="truncate text-xs font-semibold text-[#182118]">{item.name}</span>
          </span>
        )
      )}
    </div>
  );
}

function MoreMenu({ onRetry, onSimplify, onDetail }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const items = [
    { label: "Retry", handler: onRetry },
    { label: "Simplify answer", handler: onSimplify },
    { label: "Give more detail", handler: onDetail },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="More actions"
        title="More"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8A958A] transition hover:bg-[#F1F6EE] hover:text-[#166534] md:h-7 md:w-7"
      >
        <Ellipsis size={14} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-2xl border border-[#E7ECE5] bg-white p-1.5 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false);
                item.handler?.();
              }}
              className="w-full rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-[#4C574D] transition hover:bg-[#F5F8F3] hover:text-[#166534]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AssistantActions({ text, reaction, onReact, onRetry, onSimplify, onDetail }) {
  const [copied, setCopied] = useState(false);

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const reactionClass = (kind) =>
    reaction === kind
      ? "bg-[#F1F6EE] text-[#166534]"
      : "text-[#8A958A] hover:bg-[#F1F6EE] hover:text-[#166534]";

  return (
    <div className="mt-2.5 flex items-center gap-0.5 md:mt-3 md:gap-1">
      <button
        type="button"
        onClick={copyAnswer}
        title="Copy answer"
        aria-label="Copy answer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8A958A] transition hover:bg-[#F1F6EE] hover:text-[#166534] md:h-7 md:w-7"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <button
        type="button"
        onClick={() => onReact?.(reaction === "like" ? null : "like")}
        title="Helpful"
        aria-label="Helpful"
        aria-pressed={reaction === "like"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition md:h-7 md:w-7 ${reactionClass("like")}`}
      >
        <ThumbsUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => onReact?.(reaction === "dislike" ? null : "dislike")}
        title="Not helpful"
        aria-label="Not helpful"
        aria-pressed={reaction === "dislike"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition md:h-7 md:w-7 ${reactionClass("dislike")}`}
      >
        <ThumbsDown size={14} />
      </button>
      <MoreMenu onRetry={onRetry} onSimplify={onSimplify} onDetail={onDetail} />
    </div>
  );
}

export default function MessageBubble({
  message,
  streaming = false,
  onReact = null,
  onRetry = null,
  onSimplify = null,
  onDetail = null,
  onAction = null,
}) {
  const isUser = message.role === "user";
  const text = String(message.text || "");

  if (isUser) {
    const attachments = message.attachments || [];

    return (
      <div className="flex w-full flex-col items-end">
        <SentAttachments items={attachments} />
        {text ? (
          <div className="max-w-[92%] rounded-[20px] rounded-br-lg border border-[#DCEAD5] bg-[#F1F6EE] px-4 py-2.5 text-[15px] leading-relaxed text-[#182118] md:max-w-[76%] md:px-4 md:py-3">
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        ) : null}
      </div>
    );
  }

  const hasContent = Boolean(text.trim());

  return (
    <div className="flex w-full justify-start">
      <div className="w-full max-w-full md:max-w-[92%]">
        {message.error ? (
          <div className="rounded-2xl border border-[#F3D9D2] bg-[#FDF5F3] px-4 py-3 text-[15px] leading-6 text-[#8C3A22]">
            {text}
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-3.5 py-2 text-xs font-semibold text-white"
              >
                <RefreshCcw size={13} />
                Try again
              </button>
            ) : null}
          </div>
        ) : hasContent ? (
          <>
            <ResponseBlocks text={text} onAction={onAction} />
            {streaming ? <span className="assistant-typing-caret">|</span> : null}
          </>
        ) : (
          <TypingIndicator />
        )}

        {!streaming && hasContent && !message.error ? (
          <AssistantActions
            text={text}
            reaction={message.reaction || null}
            onReact={onReact}
            onRetry={onRetry}
            onSimplify={onSimplify}
            onDetail={onDetail}
          />
        ) : null}
      </div>
    </div>
  );
}
