// Conversation list mechanics, ported from the ElimuLink institution chat.
//
// History lives in localStorage for now. The shapes here match what the
// /api/v1/assistant backend will return, so persistence can move server-side
// without touching the panel.

const STORAGE_KEY = "faidafarm_assistant_chats";
const UNTITLED_CHAT_BASE = "New conversation";
const MAX_STORED_CHATS = 40;

export { UNTITLED_CHAT_BASE };

export function makeChatId() {
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function makeMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isUntitledChatTitle(title, base = UNTITLED_CHAT_BASE) {
  const pattern = new RegExp(`^${escapeRegex(base)}(?: \\d+)?$`, "i");
  return pattern.test(String(title || "").trim());
}

export function nextUntitledChatTitle(chats = [], base = UNTITLED_CHAT_BASE) {
  const used = new Set((chats || []).map((chat) => String(chat?.title || "").trim()));
  if (!used.has(base)) {
    return base;
  }

  let index = 2;
  while (used.has(`${base} ${index}`)) {
    index += 1;
  }
  return `${base} ${index}`;
}

// A farmer's first line makes a better label than "New conversation", so the
// title is derived from it once and then left alone.
export function deriveChatTitle(text) {
  const cleaned = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return UNTITLED_CHAT_BASE;
  }

  if (cleaned.length <= 44) {
    return cleaned;
  }

  const clipped = cleaned.slice(0, 44);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 20 ? clipped.slice(0, lastSpace) : clipped).trim()}...`;
}

export function formatChatStamp(timestamp) {
  try {
    const date = new Date(timestamp || Date.now());
    if (Number.isNaN(date.getTime())) {
      return "Now";
    }

    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    return sameDay
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Now";
  }
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function sectionLabelFromTimestamp(timestamp, now = Date.now()) {
  const stamp = Number(timestamp || 0);
  const date = new Date(stamp || now);
  const nowDate = new Date(now);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((startOfDay(nowDate) - startOfDay(date)) / dayMs);

  if (diffDays <= 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays <= 7) {
    return "Earlier this week";
  }
  if (date.getMonth() === nowDate.getMonth() && date.getFullYear() === nowDate.getFullYear()) {
    return "Earlier this month";
  }
  return date.toLocaleDateString([], { month: "short", year: "numeric" });
}

// Groups chats into the labelled sections the history list renders, newest
// first, preserving section order as encountered.
export function groupChatsByRecency(chats = [], now = Date.now()) {
  const sorted = [...chats].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const sections = [];
  const byLabel = new Map();

  for (const chat of sorted) {
    const label = sectionLabelFromTimestamp(chat.updatedAt, now);
    if (!byLabel.has(label)) {
      const section = { label, chats: [] };
      byLabel.set(label, section);
      sections.push(section);
    }
    byLabel.get(label).chats.push(chat);
  }

  return sections;
}

export function createChat(chats = []) {
  const now = Date.now();
  return {
    id: makeChatId(),
    title: nextUntitledChatTitle(chats),
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function loadChats() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Blob URLs and File handles are alive only for this page load, so a stored
// message keeps just enough to describe what was attached.
function stripTransientAttachments(message) {
  if (!message?.attachments?.length) {
    return message;
  }

  return {
    ...message,
    attachments: message.attachments.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      isImage: item.isImage,
    })),
  };
}

export function saveChats(chats = []) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const trimmed = [...chats]
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, MAX_STORED_CHATS)
      .map((chat) => ({ ...chat, messages: chat.messages.map(stripTransientAttachments) }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // A full or unavailable storage quota must not break the conversation.
  }
}
