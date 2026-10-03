import { Box, Stack } from '@mui/material';
import { colors } from '../theme/colors';

export function TypingDots() {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ height: 28 }} aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: colors.muted,
            animation: 'typing-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Stack>
  );
}
