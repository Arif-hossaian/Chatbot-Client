import { Box, Stack } from '@mui/material';
import { AutoAwesomeRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme/colors';
import { CopyButton } from './CopyButton';
import { Markdown } from './Markdown';
import { SuggestionChips } from './SuggestionChips';
import { ToolCallCard } from './ToolCallCard';
import { TypingDots } from './TypingDots';

function UserMessage({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          px: 2,
          py: 1.25,
          borderRadius: '18px',
          bgcolor: colors.active,
          border: `1px solid ${colors.border}`,
          fontSize: 15,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </Box>
    </motion.div>
  );
}

function AssistantMessage({ message, showSuggestions, onSuggestion }) {
  const { parts, streaming } = message;
  const lastPart = parts.at(-1);
  // Show dots before the first token and while waiting for the model after a tool finishes.
  const waiting = streaming && (!lastPart || (lastPart.type === 'tool' && lastPart.status !== 'running'));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 28,
            height: 28,
            mt: 0.25,
            flexShrink: 0,
            borderRadius: '8px',
            bgcolor: colors.surface,
            border: `1px solid ${colors.borderStrong}`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <AutoAwesomeRounded sx={{ fontSize: 15 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {parts.map((part, index) =>
            part.type === 'tool' ? (
              <ToolCallCard key={part.id} part={part} />
            ) : (
              <Markdown key={index} content={part.text} streaming={streaming && index === parts.length - 1} />
            ),
          )}
          {waiting && <TypingDots />}
          {!streaming && message.content && (
            <Box sx={{ mt: 1, ml: -0.75 }}>
              <CopyButton text={message.content} />
            </Box>
          )}
          {showSuggestions && message.suggestions?.length > 0 && (
            <SuggestionChips suggestions={message.suggestions} onPick={onSuggestion} />
          )}
        </Box>
      </Stack>
    </motion.div>
  );
}

export function MessageRow({ message, showSuggestions, onSuggestion }) {
  return message.role === 'user' ? (
    <UserMessage message={message} />
  ) : (
    <AssistantMessage message={message} showSuggestions={showSuggestions} onSuggestion={onSuggestion} />
  );
}
