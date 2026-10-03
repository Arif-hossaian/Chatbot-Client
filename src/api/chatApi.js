import { SERVER_DOWN_MESSAGE } from './http';

async function request(url, body, signal) {
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error(SERVER_DOWN_MESSAGE);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong while generating a reply.');
  }
  return response;
}

// Streams a chat reply. Calls onEvent for each server event:
// {type:'delta',text} | {type:'tool_call',id,name,args} | {type:'tool_result',id,name,result}
export async function streamChat({ messages, signal, onEvent }) {
  const response = await request('/api/chat', { messages }, signal);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line);
      if (event.type === 'error') throw new Error(event.error);
      if (event.type !== 'done') onEvent(event);
    }
  }
}

// Asks the server for JSON that matches a named schema (see server/src/schemas).
export async function fetchStructured(schemaName, input, signal) {
  const response = await request(`/api/structured/${schemaName}`, { input }, signal);
  const { data } = await response.json();
  return data;
}
