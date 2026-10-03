import { Box, ButtonBase, Typography } from '@mui/material';
import {
  AutoAwesomeRounded,
  CalculateOutlined,
  DescriptionOutlined,
  RocketLaunchOutlined,
  WbSunnyOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme/colors';

const starterPrompts = [
  { icon: WbSunnyOutlined, title: 'Check the weather', prompt: "What's the weather in Tokyo and London right now?" },
  { icon: CalculateOutlined, title: 'Do exact math', prompt: 'What is 18% tip on $246.50, split between 3 people?' },
  { icon: RocketLaunchOutlined, title: 'Plan a project', prompt: 'Summarize this project idea in a crisp plan' },
  { icon: DescriptionOutlined, title: 'Ask your documents', prompt: 'Summarize the key points of my uploaded documents' },
];

export function EmptyState({ onPick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 2.5,
            borderRadius: '14px',
            bgcolor: colors.surface,
            border: `1px solid ${colors.borderStrong}`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <AutoAwesomeRounded sx={{ fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, letterSpacing: '-0.02em' }}>
          How can I help you today?
        </Typography>
        <Typography sx={{ mt: 1, color: colors.muted, fontSize: 15 }}>
          Ask anything. I can check live weather, do exact math, and answer from your uploaded files.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        {starterPrompts.map(({ icon: Icon, title, prompt }) => (
          <ButtonBase
            key={title}
            onClick={() => onPick(prompt)}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.75,
              p: 2,
              textAlign: 'left',
              borderRadius: '14px',
              border: `1px solid ${colors.border}`,
              bgcolor: colors.surface,
              transition: 'background-color 150ms, border-color 150ms',
              '&:hover': { bgcolor: colors.hover, borderColor: colors.borderStrong },
            }}
          >
            <Icon sx={{ fontSize: 20, color: colors.muted, mb: 0.5 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
            <Typography sx={{ fontSize: 13, color: colors.subtle }}>{prompt}</Typography>
          </ButtonBase>
        ))}
      </Box>
    </motion.div>
  );
}
