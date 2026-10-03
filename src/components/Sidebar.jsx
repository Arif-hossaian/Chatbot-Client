import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { AddRounded, AutoAwesomeRounded, ChatBubbleOutlineRounded } from '@mui/icons-material';
import { colors, sidebarWidth } from '../theme/colors';

// `children` is shown at the bottom of the sidebar (used for the documents panel).
export function Sidebar({ chatList, activeChatId, onSelect, onNewChat, children }) {
  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        bgcolor: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.25, height: 60, flexShrink: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            bgcolor: colors.text,
            color: colors.bg,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <AutoAwesomeRounded sx={{ fontSize: 16 }} />
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>Assistant</Typography>
      </Stack>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <ButtonBase
          onClick={onNewChat}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            gap: 1.25,
            px: 1.5,
            py: 1.1,
            borderRadius: '10px',
            border: `1px solid ${colors.borderStrong}`,
            color: colors.text,
            fontSize: 14,
            fontWeight: 500,
            transition: 'background-color 150ms',
            '&:hover': { bgcolor: colors.hover },
          }}
        >
          <AddRounded sx={{ fontSize: 18 }} />
          New chat
        </ButtonBase>
      </Box>

      <Typography sx={{ px: 2.75, pt: 2, pb: 1, fontSize: 12, fontWeight: 500, color: colors.subtle }}>
        Recent
      </Typography>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pb: 2 }}>
        {chatList.map((chat) => {
          const selected = chat.id === activeChatId;
          return (
            <ButtonBase
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                gap: 1.25,
                px: 1.5,
                py: 1,
                mb: 0.25,
                borderRadius: '8px',
                fontSize: 14,
                textAlign: 'left',
                color: selected ? colors.text : colors.muted,
                bgcolor: selected ? colors.active : 'transparent',
                transition: 'background-color 150ms, color 150ms',
                '&:hover': { bgcolor: selected ? colors.active : colors.hover, color: colors.text },
              }}
            >
              <ChatBubbleOutlineRounded sx={{ fontSize: 16, flexShrink: 0 }} />
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.title}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      {children}
    </Box>
  );
}
