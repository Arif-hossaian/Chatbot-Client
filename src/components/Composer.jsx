import { Box, IconButton, InputBase, Tooltip, Typography } from '@mui/material';
import { ArrowUpwardRounded, AttachFileRounded, StopRounded } from '@mui/icons-material';
import { colors, contentWidth } from '../theme/colors';
import { UploadButton } from './UploadButton';

const actionButtonSx = {
  width: 36,
  height: 36,
  flexShrink: 0,
  bgcolor: colors.text,
  color: colors.bg,
  transition: 'background-color 150ms',
  '&:hover': { bgcolor: '#ffffff' },
  '&.Mui-disabled': { bgcolor: colors.active, color: colors.subtle },
};

export function Composer({ value, onChange, onSend, onStop, isStreaming, inputRef, onUpload, isUploading }) {
  return (
    <Box sx={{ flexShrink: 0, px: { xs: 1.5, md: 3 }, pt: 1, pb: 2 }}>
      <Box sx={{ maxWidth: contentWidth, mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            p: 1,
            borderRadius: '22px',
            bgcolor: colors.surface,
            border: `1px solid ${colors.borderStrong}`,
            transition: 'border-color 150ms',
            '&:focus-within': { borderColor: colors.focus },
          }}
        >
          <UploadButton
            icon={<AttachFileRounded sx={{ fontSize: 20 }} />}
            tooltip="Upload PDF or Word file"
            onFiles={onUpload}
            isUploading={isUploading}
            sx={{ width: 36, height: 36, flexShrink: 0 }}
          />
          <InputBase
            inputRef={inputRef}
            autoFocus
            multiline
            fullWidth
            maxRows={8}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder="Message Assistant..."
            sx={{
              py: 0.9,
              fontSize: 15,
              color: colors.text,
              '& textarea::placeholder': { color: colors.subtle, opacity: 1 },
            }}
          />
          {isStreaming ? (
            <Tooltip title="Stop generating">
              <IconButton onClick={onStop} aria-label="Stop generating" sx={actionButtonSx}>
                <StopRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton onClick={onSend} disabled={!value.trim()} aria-label="Send message" sx={actionButtonSx}>
              <ArrowUpwardRounded sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>
        <Typography sx={{ mt: 1, textAlign: 'center', fontSize: 12, color: colors.subtle }}>
          AI can make mistakes. Check important info.
        </Typography>
      </Box>
    </Box>
  );
}
