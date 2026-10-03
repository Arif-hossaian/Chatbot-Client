// Keep these in sync with server/src/config/rag.js
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt', '.md'];
export const MAX_FILE_SIZE_MB = 10;

// Value for <input type="file" accept="...">
export const ACCEPT_ATTRIBUTE = ALLOWED_EXTENSIONS.join(',');
