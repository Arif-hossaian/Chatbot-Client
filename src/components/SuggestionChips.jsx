import { ButtonBase, Stack } from '@mui/material';
import { NorthEastRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme/colors';

// Follow-up suggestions produced by the `follow_ups` structured-output schema.
export function SuggestionChips({ suggestions, onPick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
        {suggestions.map((suggestion) => (
          <ButtonBase
            key={suggestion}
            onClick={() => onPick(suggestion)}
            sx={{
              gap: 0.75,
              px: 1.5,
              py: 0.9,
              borderRadius: '999px',
              border: `1px solid ${colors.borderStrong}`,
              color: colors.muted,
              fontSize: 13.5,
              textAlign: 'left',
              transition: 'background-color 150ms, color 150ms',
              '&:hover': { bgcolor: colors.hover, color: colors.text },
            }}
          >
            <NorthEastRounded sx={{ fontSize: 14 }} />
            {suggestion}
          </ButtonBase>
        ))}
      </Stack>
    </motion.div>
  );
}
