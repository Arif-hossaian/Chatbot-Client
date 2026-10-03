export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createChat() {
  return { id: createId('chat'), title: 'New chat', messages: [] };
}

export function formatChatTitle(messageText) {
  const cleanText = messageText.replace(/\s+/g, ' ').trim();
  return cleanText.length > 32 ? `${cleanText.slice(0, 32).trim()}...` : cleanText;
}

// The server only needs role + text; tool calls are re-run per turn, not replayed.
export function toApiMessages(messages) {
  return messages.filter((m) => m.content).map(({ role, content }) => ({ role, content }));
}

// An assistant message is an ordered list of parts so text and tool calls
// render in the order they happened: [{type:'text',text}, {type:'tool',...}, ...]
export function applyStreamEvent(message, event) {
  switch (event.type) {
    case 'delta': {
      const parts = [...message.parts];
      const last = parts.at(-1);
      if (last?.type === 'text') parts[parts.length - 1] = { ...last, text: last.text + event.text };
      else parts.push({ type: 'text', text: event.text });
      return { ...message, content: message.content + event.text, parts };
    }
    case 'tool_call':
      return {
        ...message,
        parts: [
          ...message.parts,
          { type: 'tool', id: event.id, name: event.name, args: event.args, status: 'running' },
        ],
      };
    case 'tool_result':
      return {
        ...message,
        parts: message.parts.map((part) =>
          part.type === 'tool' && part.id === event.id
            ? { ...part, result: event.result, status: event.result?.error ? 'error' : 'done' }
            : part,
        ),
      };
    default:
      return message;
  }
}

export function finalizeMessage(message) {
  return {
    ...message,
    streaming: false,
    parts: message.parts.map((part) =>
      part.type === 'tool' && part.status === 'running'
        ? { ...part, status: 'error', result: { error: 'Cancelled' } }
        : part,
    ),
  };
}
