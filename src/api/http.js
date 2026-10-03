export const SERVER_DOWN_MESSAGE = 'Cannot reach the server. Is it running? (cd server && npm run dev)';

// Small wrapper around fetch for normal (non-streaming) JSON requests.
// Returns the parsed JSON, or throws an Error with the server's error message.
export async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
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
