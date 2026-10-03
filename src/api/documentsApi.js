import { requestJson } from './http';

// Get the list of uploaded documents.
export async function getDocuments() {
  const data = await requestJson('/api/documents');
  return data.documents;
}

// Upload one file. The server reads it, splits it into chunks and saves them in Qdrant.
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file); // the server expects the field name "file"

  // Note: don't set Content-Type yourself; the browser adds it (with the boundary) for FormData.
  const data = await requestJson('/api/documents', { method: 'POST', body: formData });
  return data.document;
}

// Delete a document and all its chunks.
export async function deleteDocument(documentId) {
  await requestJson(`/api/documents/${documentId}`, { method: 'DELETE' });
}
