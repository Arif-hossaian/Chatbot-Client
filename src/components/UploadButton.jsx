import { useRef } from 'react';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ACCEPT_ATTRIBUTE } from '../config/uploads';
import { colors } from '../theme/colors';

// An icon button that opens the file picker and passes the chosen files to onFiles.
export function UploadButton({ icon, tooltip, onFiles, isUploading = false, sx }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const files = Array.from(event.target.files || []);
    // Reset so choosing the same file again still triggers onChange.
    event.target.value = '';
    if (files.length > 0) onFiles(files);
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={ACCEPT_ATTRIBUTE} multiple hidden onChange={handleChange} />
      <Tooltip title={isUploading ? 'Uploading...' : tooltip}>
        <IconButton
          onClick={() => inputRef.current?.click()}
          aria-label={tooltip}
          sx={{ color: colors.muted, '&:hover': { color: colors.text }, ...sx }}
        >
          {isUploading ? <CircularProgress size={18} thickness={5} sx={{ color: colors.muted }} /> : icon}
        </IconButton>
      </Tooltip>
    </>
  );
}
