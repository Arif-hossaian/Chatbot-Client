import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { CheckRounded, ContentCopyRounded } from '@mui/icons-material';
import { colors } from '../theme/colors';

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); nothing to do.
    }
  };

  return (
    <Tooltip title={copied ? 'Copied' : 'Copy'}>
      <IconButton
        size="small"
        onClick={copy}
        aria-label="Copy response"
        sx={{ color: colors.subtle, '&:hover': { color: colors.text } }}
      >
        {copied ? <CheckRounded sx={{ fontSize: 16 }} /> : <ContentCopyRounded sx={{ fontSize: 16 }} />}
      </IconButton>
    </Tooltip>
  );
}
