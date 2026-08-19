// The assistant as a layer over every farmer page rather than a destination.
//
// A floating button opens a bottom sheet on a phone and a right-hand panel on
// desktop, over whatever page the farmer is already on - so the assistant knows
// what they are looking at and can seed relevant questions. Conversation
// history lives inside the panel, not in the app's navigation.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { History, MessageSquarePlus, Sparkles, Trash2, WifiOff, X } from "lucide-react";
import Composer from "./Composer";
import MessageBubble from "./MessageBubble";
import useAssistantChat from "./useAssistantChat";
import useAttachments from "./useAttachments";
import { ASSISTANT_API_ENABLED } from "./assistantClient";
import { formatChatStamp, groupChatsByRecency } from "./chatHistory";

const ASSISTANT_NAME = "Ask Faida";

// Opening the panel from a page should offer questions about that page.
const SUGGESTIONS_BY_PAGE = {
  dashboard: [
    "Should I sell my ndengu now?",
    "What is today's price?",
    "What needs my attention this week?",
  ],
  "my-farm": [
    "How is my ndengu crop doing?",
    "When should I harvest?",
    "What should I plant next season?",
  ],
  "market-intelligence": [
    "What is today's price?",
    "Is the price rising or falling?",
    "Which market pays best for ndengu?",
  ],
  "sell-smart": [
    "Should I sell my ndengu now?",
    "How much would I earn at today's price?",
    "What happens if I wait two weeks?",
  ],
  "find-buyers": [
    "Who are the best buyers near me?",
    "Which buyer pays the most for ndengu?",
    "Which buyers collect from my farm?",
  ],
  weather: [
    "What is the weather doing this week?",
    "Will the rain affect my harvest?",
    "Should I irrigate this week?",
  ],
  alerts: ["What is most urgent right now?", "Explain this price alert"],
  "tools-services": ["What tools do I need this season?", "Where can I hire a planter?"],
};

const DEFAULT_SUGGESTIONS = [
  "Should I sell my ndengu now?",
  "Who are the best buyers near me?",
  "What is the weather doing this week?",
];

function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine !== false
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
}

function EmptyState({ pageLabel, suggestions, onPick }) {
  return (
    <div className="px-4 py-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F6EE]">
        <Sparkles className="h-6 w-6 text-[#2F8F46]" />
      </div>
      <h3 className="mt-4 text-[22px] font-bold leading-tight text-[#182118]">
        How can I help with your farm?
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#667164]">
        {pageLabel
          ? `Ask about ${pageLabel.toLowerCase()}, or anything else on your farm.`
          : "Ask about your records, prices, weather or buyers."}
      </p>

      <div className="mt-5 space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="w-full rounded-2xl border border-[#E4EAE1] bg-white px-4 py-3 text-left text-sm font-medium text-[#2C3830] transition hover:border-[#CFE3C8] hover:bg-[#F7FBF5]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function HistoryView({ chats, activeChatId, onSelect, onDelete }) {
  const sections = useMemo(() => groupChatsByRecency(chats), [chats]);

  if (!chats.length) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-[#667164]">No past conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-3">
      {sections.map((section) => (
        <div key={section.label} className="mb-4">
          <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958A]">
            {section.label}
          </p>
          <div className="space-y-1">
            {section.chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 rounded-2xl px-3 py-2.5 transition ${
                  chat.id === activeChatId ? "bg-[#F1F6EE]" : "hover:bg-[#F5F8F3]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(chat.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold text-[#182118]">{chat.title}</p>
                  <p className="mt-0.5 text-xs text-[#8A958A]">
                    {formatChatStamp(chat.updatedAt)} &middot; {chat.messages.length}{" "}
                    {chat.messages.length === 1 ? "message" : "messages"}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(chat.id)}
                  aria-label={`Delete ${chat.title}`}
                  title="Delete"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#A9B3A7] transition hover:bg-white hover:text-[#C2542F]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AssistantDock({ page = "", pageLabel = "" }) {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const online = useOnlineStatus();

  const chat = useAssistantChat({ context: { page, pageLabel } });
  const attachments = useAttachments();
  const { messages, isStreaming, streamingMessageId } = chat;

  const suggestions = SUGGESTIONS_BY_PAGE[page] || DEFAULT_SUGGESTIONS;

  // Follow the stream as it grows.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node || showHistory) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [messages, showHistory]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A bottom sheet over a scrolling page should not scroll the page behind it.
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const submitDraft = useCallback(() => {
    const text = draft;
    const files = attachments.items;
    setDraft("");
    // Hand the items to the message and stop tracking them here; the sent
    // message owns the previews from now on.
    attachments.clear();
    setShowHistory(false);
    chat.send(text, files);
  }, [attachments, chat, draft]);

  const pickSuggestion = useCallback(
    (suggestion) => {
      setShowHistory(false);
      chat.send(suggestion);
    },
    [chat]
  );

  const conversation = (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {showHistory ? (
          <HistoryView
            chats={chat.chats}
            activeChatId={chat.activeChatId}
            onSelect={(id) => {
              chat.selectChat(id);
              setShowHistory(false);
            }}
            onDelete={chat.deleteChat}
          />
        ) : messages.length ? (
          <div className="space-y-5 px-4 py-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                streaming={message.id === streamingMessageId}
                onReact={null}
                onRetry={chat.retryLast}
                onSimplify={() => chat.rephraseLast("Explain that more simply.")}
                onDetail={() => chat.rephraseLast("Give me more detail on that.")}
                onAction={pickSuggestion}
              />
            ))}
          </div>
        ) : (
          <EmptyState pageLabel={pageLabel} suggestions={suggestions} onPick={pickSuggestion} />
        )}
      </div>

      {!online ? (
        <div className="flex items-center gap-2 border-t border-[#F2E2C4] bg-[#FDF8EE] px-4 py-2.5 text-xs font-semibold text-[#7A5510]">
          <WifiOff size={14} />
          You are offline. The assistant needs a connection to answer.
        </div>
      ) : !ASSISTANT_API_ENABLED ? (
        <div className="border-t border-[#E4EBDD] bg-[#F7FBF5] px-4 py-2 text-[11px] font-semibold text-[#5F7A5F]">
          Demonstration replies - the assistant backend is not connected yet.
        </div>
      ) : null}

      <Composer
        value={draft}
        onChange={setDraft}
        onSubmit={submitDraft}
        onStop={chat.stop}
        streaming={isStreaming}
        disabled={!online}
        attachments={attachments.items}
        attachmentError={attachments.error}
        onAddFiles={attachments.add}
        onRemoveAttachment={attachments.remove}
      />
    </>
  );

  const header = (
    <div className="flex items-center justify-between gap-2 border-b border-[#E7ECE5] px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F1F6EE]">
          <Sparkles className="h-4 w-4 text-[#2F8F46]" />
        </span>
        <p className="truncate text-[15px] font-bold text-[#182118]">
          {showHistory ? "Conversations" : ASSISTANT_NAME}
        </p>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => {
            setShowHistory(false);
            chat.startNewChat();
          }}
          aria-label="New conversation"
          title="New conversation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#667164] transition hover:bg-[#F1F6EE] hover:text-[#166534]"
        >
          <MessageSquarePlus size={17} />
        </button>
        <button
          type="button"
          onClick={() => setShowHistory((prev) => !prev)}
          aria-label="Conversation history"
          aria-pressed={showHistory}
          title="History"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
            showHistory
              ? "bg-[#F1F6EE] text-[#166534]"
              : "text-[#667164] hover:bg-[#F1F6EE] hover:text-[#166534]"
          }`}
        >
          <History size={17} />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close assistant"
          title="Close"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#667164] transition hover:bg-[#F1F6EE] hover:text-[#166534]"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${ASSISTANT_NAME}`}
          className="fixed bottom-[86px] right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#166534] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(22,101,52,0.32)] transition hover:bg-[#14522B] md:bottom-6 md:right-6"
        >
          <Sparkles className="h-5 w-5" />
          <span className="hidden sm:inline">{ASSISTANT_NAME}</span>
        </button>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-[#0F1A12]/35 md:bg-[#0F1A12]/20"
          />

          {/* Phone: bottom sheet. Desktop: right-hand panel. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={ASSISTANT_NAME}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[86svh] flex-col rounded-t-[26px] bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[440px] md:rounded-none md:rounded-l-[26px]"
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#DDE5D9] md:hidden" />
            {header}
            {conversation}
          </div>
        </>
      ) : null}
    </>
  );
}
