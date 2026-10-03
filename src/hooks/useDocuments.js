import { useEffect, useState } from 'react';
import { deleteDocument, getDocuments, uploadDocument } from '../api/documentsApi';
import { validateFile } from '../utils/files';

// Everything about uploaded documents lives here, so components only need to
// call upload(files) / remove(id) and render the state.
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [uploadingNames, setUploadingNames] = useState([]); // file names currently uploading
  const [deletingId, setDeletingId] = useState(null);
  // Feedback for the user: { type: 'success' | 'error', text: '...' } or null
  const [message, setMessage] = useState(null);

  // Load the document list once when the app starts.
  useEffect(() => {
    getDocuments()
      .then(setDocuments)
      .catch((err) => setMessage({ type: 'error', text: `Could not load documents: ${err.message}` }));
  }, []);

  // Upload one or more files, one after another.
  const upload = async (files) => {
    for (const file of files) {
      const problem = validateFile(file);
      if (problem) {
        setMessage({ type: 'error', text: problem });
        continue;
      }

      setUploadingNames((names) => [...names, file.name]);
      try {
        const document = await uploadDocument(file);
        setDocuments((current) => [document, ...current]);
        setMessage({
          type: 'success',
          text: `"${document.fileName}" saved (${document.totalChunks} chunks). Ask me anything about it!`,
        });
      } catch (err) {
        setMessage({ type: 'error', text: `Upload failed for "${file.name}": ${err.message}` });
      } finally {
        setUploadingNames((names) => names.filter((name) => name !== file.name));
      }
    }
  };

  // Delete a document.
  const remove = async (documentId) => {
    setDeletingId(documentId);
    try {
      await deleteDocument(documentId);
      setDocuments((current) => current.filter((doc) => doc.documentId !== documentId));
    } catch (err) {
      setMessage({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setDeletingId(null);
    }
  };

  const clearMessage = () => setMessage(null);

  return { documents, uploadingNames, deletingId, message, upload, remove, clearMessage };
}
