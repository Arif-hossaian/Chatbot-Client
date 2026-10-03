import { Box, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DeleteOutlineRounded, DescriptionOutlined, UploadFileRounded } from '@mui/icons-material';
import { colors } from '../theme/colors';
import { formatFileSize } from '../utils/files';
import { UploadButton } from './UploadButton';

// One row in the list: file icon, name, size info, and a delete button.
function DocumentRow({ document, isDeleting, onDelete }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        px: 1.5,
        py: 0.75,
        borderRadius: '8px',
        '&:hover': { bgcolor: colors.hover },
        '&:hover .delete-button': { opacity: 1 },
      }}
    >
      <DescriptionOutlined sx={{ fontSize: 16, color: colors.muted, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 13.5, color: colors.text }}>
          {document.fileName}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: colors.subtle }}>
          {formatFileSize(document.fileSize)} · {document.totalChunks} chunks
        </Typography>
      </Box>
      {isDeleting ? (
        <CircularProgress size={14} thickness={5} sx={{ color: colors.muted, mx: 0.75 }} />
      ) : (
        <Tooltip title="Delete">
          <IconButton
            className="delete-button"
            size="small"
            onClick={() => onDelete(document.documentId)}
            aria-label={`Delete ${document.fileName}`}
            sx={{
              color: colors.subtle,
              // Hidden until hover on desktop; always visible on touch screens.
              opacity: { xs: 1, md: 0 },
              '&:hover': { color: colors.danger },
              '&.Mui-focusVisible': { opacity: 1 },
            }}
          >
            <DeleteOutlineRounded sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

// A row shown while a file is still uploading.
function UploadingRow({ fileName }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 1.5, py: 0.75 }}>
      <CircularProgress size={14} thickness={5} sx={{ color: colors.muted, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 13.5, color: colors.muted }}>
          {fileName}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: colors.subtle }}>Reading and saving...</Typography>
      </Box>
    </Stack>
  );
}

export function DocumentsPanel({ documents, uploadingNames, deletingId, onUpload, onDelete }) {
  const isEmpty = documents.length === 0 && uploadingNames.length === 0;

  return (
    <Box sx={{ borderTop: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', maxHeight: '40%' }}>
      <Stack direction="row" alignItems="center" sx={{ pl: 2.75, pr: 1.5, pt: 1.5, pb: 0.5 }}>
        <Typography sx={{ flex: 1, fontSize: 12, fontWeight: 500, color: colors.subtle }}>Documents</Typography>
        <UploadButton
          icon={<UploadFileRounded sx={{ fontSize: 18 }} />}
          tooltip="Upload PDF or Word file"
          onFiles={onUpload}
          isUploading={uploadingNames.length > 0}
          sx={{ p: 0.75 }}
        />
      </Stack>

      <Box sx={{ overflowY: 'auto', px: 1.5, pb: 2 }}>
        {isEmpty && (
          <Typography
            sx={{
              mx: 1,
              mt: 0.5,
              p: 1.5,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: colors.subtle,
              border: `1px dashed ${colors.borderStrong}`,
              borderRadius: '10px',
            }}
          >
            Upload PDF, Word or text files and the assistant can answer questions from them.
          </Typography>
        )}

        {uploadingNames.map((name) => (
          <UploadingRow key={name} fileName={name} />
        ))}

        {documents.map((document) => (
          <DocumentRow
            key={document.documentId}
            document={document}
            isDeleting={deletingId === document.documentId}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
}
