// Where the backend lives. Set VITE_API_URL in client/.env (e.g. https://my-server.com).
// If it's empty, requests go to "/api/..." on the same host, which the Vite dev server
// forwards to http://localhost:5000 (see vite.config.js).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// Builds a full URL: apiUrl('/api/chat') -> 'https://my-server.com/api/chat'
export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export const SERVER_DOWN_MESSAGE = API_BASE_URL
  ? `Cannot reach the server at ${API_BASE_URL}. Please try again in a moment.`
  : 'Cannot reach the server. Is it running? (cd server && npm run dev)';

// Small wrapper around fetch for normal (non-streaming) JSON requests.
// Returns the parsed JSON, or throws an Error with the server's error message.
export async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(apiUrl(url), options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error(SERVER_DOWN_MESSAGE);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status}).`);
  }
  return data;
}
