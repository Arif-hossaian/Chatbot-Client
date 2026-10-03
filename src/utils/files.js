import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from '../config/uploads';

// "report.PDF" -> ".pdf"
export function getExtension(fileName) {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex === -1 ? '' : fileName.slice(dotIndex).toLowerCase();
}

// 2048 -> "2 KB"
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Returns an error message if the file can't be uploaded, or null if it's fine.
// (The server checks too; this just gives faster feedback.)
export function validateFile(file) {
  const extension = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `"${file.name}" is not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
}
