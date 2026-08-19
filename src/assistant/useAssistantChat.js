import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { describeAssistantError, streamAssistantReply } from "./assistantClient";
import {
  createChat,
  deriveChatTitle,
  isUntitledChatTitle,
  loadChats,
  makeMessageId,
  saveChats,
} from "./chatHistory";

// Owns the conversation list, the active conversation and one in-flight stream.
export default function useAssistantChat({ context = null } = {}) {
  const [chats, setChats] = useState(() => loadChats());
  const [activeChatId, setActiveChatId] = useState(() => {
    const stored = loadChats();
    return stored.length ? stored[0].id : null;
  });
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || null,
    [chats, activeChatId]
  );

  const isStreaming = Boolean(streamingMessageId);

  const patchChat = useCallback((chatId, updater) => {
    setChats((current) =>
      current.map((chat) => (chat.id === chatId ? { ...updater(chat), updatedAt: Date.now() } : chat))
    );
  }, []);

  const startNewChat = useCallback(() => {
    setChats((current) => {
      // Don't pile up empty conversations if one is already blank.
      const existingEmpty = current.find((chat) => !chat.messages.length);
      if (existingEmpty) {
        setActiveChatId(existingEmpty.id);
        return current;
      }

      const chat = createChat(current);
      setActiveChatId(chat.id);
      return [chat, ...current];
    });
  }, []);

  const deleteChat = useCallback(
    (chatId) => {
      setChats((current) => {
        const remaining = current.filter((chat) => chat.id !== chatId);
        if (chatId === activeChatId) {
          setActiveChatId(remaining.length ? remaining[0].id : null);
        }
        return remaining;
      });
    },
    [activeChatId]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreamingMessageId(null);
  }, []);

  // Runs one request/response round against `history`, appending the answer to
  // `chatId`. Shared by send, retry and the rephrase actions.
  const runTurn = useCallback(
    async (chatId, history) => {
      const assistantId = makeMessageId();
      const controller = new AbortController();
      abortRef.current = controller;

      patchChat(chatId, (chat) => ({
        ...chat,
        messages: [...chat.messages, { id: assistantId, role: "assistant", text: "", createdAt: Date.now() }],
      }));
      setStreamingMessageId(assistantId);

      const applyText = (text, extra = {}) => {
        patchChat(chatId, (chat) => ({
          ...chat,
          messages: chat.messages.map((message) =>
            message.id === assistantId ? { ...message, text, ...extra } : message
          ),
        }));
      };

      const outcome = await streamAssistantReply({
        messages: history,
        context,
        signal: controller.signal,
        onChunk: (_delta, streamedText) => applyText(streamedText),
      });

      abortRef.current = null;
      setStreamingMessageId(null);

      if (outcome.aborted) {
        // Keep whatever arrived; an empty stub is noise, so drop it.
        patchChat(chatId, (chat) => ({
          ...chat,
          messages: chat.messages.filter(
            (message) => message.id !== assistantId || String(message.text || "").trim()
          ),
        }));
        return;
      }

      if (!outcome.ok) {
        applyText(describeAssistantError(outcome.reason), { error: true });
        return;
      }

      applyText(outcome.text);
    },
    [context, patchChat]
  );

  const send = useCallback(
    async (rawText, attachments = []) => {
      const text = String(rawText || "").trim();
      // A photo on its own is a valid question: "what is wrong with this crop?"
      if ((!text && !attachments.length) || isStreaming) {
        return;
      }

      let chatId = activeChatId;
      let history = [];

      setChats((current) => {
        let working = current;
        let chat = working.find((item) => item.id === chatId);

        if (!chat) {
          chat = createChat(working);
          chatId = chat.id;
          working = [chat, ...working];
        }

        const userMessage = {
          id: makeMessageId(),
          role: "user",
          text,
          attachments,
          createdAt: Date.now(),
        };
        history = [...chat.messages, userMessage].map((message) => ({
          role: message.role,
          text: message.text,
          attachments: (message.attachments || []).map((item) => ({
            name: item.name,
            type: item.type,
            isImage: item.isImage,
          })),
        }));

        return working.map((item) =>
          item.id === chatId
            ? {
                ...item,
                // The first question makes a better label than "New conversation".
                title: isUntitledChatTitle(item.title)
                  ? deriveChatTitle(text || (attachments[0]?.isImage ? "Crop photo" : "Attachment"))
                  : item.title,
                messages: [...item.messages, userMessage],
                updatedAt: Date.now(),
              }
            : item
        );
      });

      setActiveChatId(chatId);
      await runTurn(chatId, history);
    },
    [activeChatId, isStreaming, runTurn]
  );

  // Drops the last answer and asks again from the same history.
  const retryLast = useCallback(async () => {
    if (isStreaming || !activeChat) {
      return;
    }

    const messages = [...activeChat.messages];
    while (messages.length && messages[messages.length - 1].role === "assistant") {
      messages.pop();
    }
    if (!messages.length) {
      return;
    }

    const chatId = activeChat.id;
    patchChat(chatId, (chat) => ({ ...chat, messages }));
    await runTurn(
      chatId,
      messages.map((message) => ({ role: message.role, text: message.text }))
    );
  }, [activeChat, isStreaming, patchChat, runTurn]);

  const rephraseLast = useCallback(
    async (instruction) => {
      if (isStreaming || !activeChat?.messages.length) {
        return;
      }
      await send(instruction);
    },
    [activeChat, isStreaming, send]
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    activeChat,
    activeChatId,
    chats,
    deleteChat,
    isStreaming,
    messages: activeChat?.messages || [],
    rephraseLast,
    retryLast,
    selectChat: setActiveChatId,
    send,
    startNewChat,
    stop,
    streamingMessageId,
  };
}
