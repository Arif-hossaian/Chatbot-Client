import { useState } from 'react';
import { Box, ButtonBase, CircularProgress, Collapse, Typography } from '@mui/material';
import { CheckCircleRounded, ErrorOutlineRounded, ExpandMoreRounded } from '@mui/icons-material';
import { colors, monoFont } from '../theme/colors';

const toolLabels = {
  get_weather: 'Checked the weather',
  calculate: 'Calculated',
  get_current_datetime: 'Checked the time',
  search_documents: 'Searched your documents',
};

function StatusIcon({ status }) {
  if (status === 'running') return <CircularProgress size={14} thickness={5} sx={{ color: colors.muted }} />;
  if (status === 'error') return <ErrorOutlineRounded sx={{ fontSize: 16, color: colors.danger }} />;
  return <CheckCircleRounded sx={{ fontSize: 16, color: colors.success }} />;
}

function JsonBlock({ label, value }) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.subtle }}>
        {label}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          mt: 0.75,
          p: 1.25,
          borderRadius: '8px',
          bgcolor: colors.bg,
          border: `1px solid ${colors.border}`,
          fontFamily: monoFont,
          fontSize: 12.5,
          lineHeight: 1.55,
          color: colors.muted,
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(value, null, 2)}
      </Box>
    </Box>
  );
}

// Shows one function call made by the model; click to see arguments and result.
export function ToolCallCard({ part }) {
  const [open, setOpen] = useState(false);
  const running = part.status === 'running';
  const label = running ? `Running ${part.name}...` : (toolLabels[part.name] ?? `Used ${part.name}`);
  const summary = Object.values(part.args ?? {}).join(', ');

  return (
    <Box
      sx={{
        my: 1.5,
        maxWidth: 560,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.sidebar,
        overflow: 'hidden',
      }}
    >
      <ButtonBase
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          gap: 1.25,
          px: 1.5,
          py: 1,
          fontSize: 13.5,
          textAlign: 'left',
          transition: 'background-color 150ms',
          '&:hover': { bgcolor: colors.hover },
        }}
      >
        <StatusIcon status={part.status} />
        <Box component="span" sx={{ color: colors.text, flexShrink: 0 }}>
          {label}
        </Box>
        <Box
          component="span"
          sx={{
            flex: 1,
            minWidth: 0,
            color: colors.subtle,
            fontFamily: monoFont,
            fontSize: 12.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {summary}
        </Box>
        <ExpandMoreRounded
          sx={{ fontSize: 18, color: colors.subtle, transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </ButtonBase>
      <Collapse in={open}>
        <Box sx={{ px: 1.5, pb: 1.5, borderTop: `1px solid ${colors.border}` }}>
          <JsonBlock label={`${part.name} arguments`} value={part.args ?? {}} />
          {part.result && <JsonBlock label="Result" value={part.result} />}
        </Box>
      </Collapse>
    </Box>
  );
}
