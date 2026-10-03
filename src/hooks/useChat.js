import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchStructured, streamChat } from '../api/chatApi';
import {
  applyStreamEvent,
  createChat,
  createId,
  finalizeMessage,
  formatChatTitle,
  toApiMessages,
} from '../utils/chat';

export function useChat() {
  const [chatList, setChatList] = useState(() => [createChat()]);
  const [activeChatId, setActiveChatId] = useState(() => chatList[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const activeChat = chatList.find((chat) => chat.id === activeChatId) ?? chatList[0];

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateMessages = useCallback((chatId, updater) => {
    setChatList((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, messages: updater(chat.messages) } : chat)),
    );
  }, []);

  const updateMessage = useCallback(
    (chatId, messageId, updater) => {
      updateMessages(chatId, (messages) => messages.map((m) => (m.id === messageId ? updater(m) : m)));
    },
    [updateMessages],
  );

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    setError('');
  };

  // Returns false when the current chat is already empty (nothing to create).
  const newChat = () => {
    if (activeChat.messages.length === 0) return false;
    const chat = createChat();
    setChatList((prev) => [chat, ...prev]);
    selectChat(chat.id);
    return true;
  };

  const stop = () => abortRef.current?.abort();

  // Structured output: ask for follow-up suggestions once a reply is complete.
  const loadSuggestions = (chatId, messageId, history) => {
    fetchStructured('follow_ups', { messages: history })
      .then((data) => updateMessage(chatId, messageId, (m) => ({ ...m, suggestions: data.suggestions })))
      .catch(() => {
        // Suggestions are optional; ignore failures.
      });
  };

  const send = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isStreaming) return false;

    const chatId = activeChat.id;
    const userMessage = { id: createId('user'), role: 'user', content: trimmed };
    const assistantId = createId('assistant');
    const history = toApiMessages([...activeChat.messages, userMessage]);

    setChatList((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          title: chat.messages.length ? chat.title : formatChatTitle(trimmed),
          messages: [
            ...chat.messages,
            userMessage,
            { id: assistantId, role: 'assistant', content: '', parts: [], streaming: true },
          ],
        };
      }),
    );
    setError('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = '';
    let completed = false;

    try {
      await streamChat({
        messages: history,
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === 'delta') reply += event.text;
          updateMessage(chatId, assistantId, (m) => applyStreamEvent(m, event));
        },
      });
      completed = true;
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Unable to get a response right now.');
    } finally {
      // Keep whatever arrived; drop the placeholder if nothing did.
      updateMessages(chatId, (messages) =>
        messages.flatMap((m) => {
          if (m.id !== assistantId) return [m];
          return m.content || m.parts.length ? [finalizeMessage(m)] : [];
        }),
      );
      abortRef.current = null;
      setIsStreaming(false);
    }

    if (completed && reply) {
      loadSuggestions(chatId, assistantId, [...history, { role: 'assistant', content: reply }]);
    }
    return true;
  };

  return { chatList, activeChat, isStreaming, error, selectChat, newChat, send, stop };
}
