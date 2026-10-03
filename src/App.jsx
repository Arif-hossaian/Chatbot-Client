import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Drawer, IconButton, Snackbar, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AddRounded, MenuRounded } from '@mui/icons-material';
import { Composer } from './components/Composer';
import { DocumentsPanel } from './components/DocumentsPanel';
import { EmptyState } from './components/EmptyState';
import { MessageRow } from './components/MessageRow';
import { Sidebar } from './components/Sidebar';
import { useChat } from './hooks/useChat';
import { useDocuments } from './hooks/useDocuments';
import { colors, contentWidth } from './theme/colors';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { chatList, activeChat, isStreaming, error, selectChat, newChat, send, stop } = useChat();
  const documents = useDocuments();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const messages = activeChat.messages;
  const hasMessages = messages.length > 0;

  // Follow the stream as it grows, unless the user scrolled up to read.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [activeChat, error]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    stickToBottomRef.current = true;
    if (isMobile) setDrawerOpen(false);
  };

  const handleNewChat = () => {
    if (newChat()) setInput('');
    stickToBottomRef.current = true;
    if (isMobile) setDrawerOpen(false);
    inputRef.current?.focus();
  };

  const handleSend = async (text) => {
    if (isStreaming || !text.trim()) return;
    stickToBottomRef.current = true;
    await send(text);
    if (!isMobile) inputRef.current?.focus();
  };

  const handleComposerSend = () => {
    if (isStreaming || !input.trim()) return;
    handleSend(input);
    setInput('');
  };

  const sidebar = (
    <Sidebar
      chatList={chatList}
      activeChatId={activeChat.id}
      onSelect={handleSelectChat}
      onNewChat={handleNewChat}
    >
      <DocumentsPanel
        documents={documents.documents}
        uploadingNames={documents.uploadingNames}
        deletingId={documents.deletingId}
        onUpload={documents.upload}
        onDelete={documents.remove}
      />
    </Sidebar>
  );

  return (
    <Box sx={{ display: 'flex', height: '100dvh', bgcolor: colors.bg, color: colors.text, overflow: 'hidden' }}>
      {isMobile ? (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          slotProps={{ paper: { sx: { bgcolor: colors.sidebar, backgroundImage: 'none', borderRight: 'none' } } }}
        >
          {sidebar}
        </Drawer>
      ) : (
        sidebar
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ height: 60, flexShrink: 0, px: { xs: 1, md: 3 }, borderBottom: `1px solid ${colors.border}` }}
        >
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open chats" sx={{ color: colors.muted }}>
              <MenuRounded />
            </IconButton>
          )}
          <Typography noWrap sx={{ flex: 1, fontSize: 15, fontWeight: 500 }}>
            {activeChat.title}
          </Typography>
          {isMobile && (
            <IconButton onClick={handleNewChat} aria-label="New chat" sx={{ color: colors.muted }}>
              <AddRounded />
            </IconButton>
          )}
        </Stack>

        <Box ref={scrollRef} onScroll={handleScroll} sx={{ flex: 1, overflowY: 'auto' }}>
          <Box
            sx={{
              maxWidth: contentWidth,
              minHeight: '100%',
              mx: 'auto',
              px: { xs: 2, md: 3 },
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: hasMessages ? 'flex-start' : 'center',
            }}
          >
            {hasMessages ? (
              <Stack spacing={4}>
                {messages.map((message, index) => (
                  <MessageRow
                    key={message.id}
                    message={message}
                    showSuggestions={!isStreaming && index === messages.length - 1}
                    onSuggestion={handleSend}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyState onPick={handleSend} />
            )}

            {error && (
              <Box
                role="alert"
                sx={{
                  mt: 3,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  bgcolor: 'rgba(248, 113, 113, 0.06)',
                  color: '#fca5a5',
                  fontSize: 14,
                }}
              >
                {error}
              </Box>
            )}
          </Box>
        </Box>

        <Composer
          value={input}
          onChange={setInput}
          onSend={handleComposerSend}
          onStop={stop}
          isStreaming={isStreaming}
          inputRef={inputRef}
          onUpload={documents.upload}
          isUploading={documents.uploadingNames.length > 0}
        />
      </Box>

      {/* Upload / delete feedback (works on mobile too, where the sidebar is hidden). */}
      <Snackbar
        open={Boolean(documents.message)}
        autoHideDuration={5000}
        onClose={(_event, reason) => reason !== 'clickaway' && documents.clearMessage()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {documents.message ? (
          <Alert
            severity={documents.message.type}
            variant="outlined"
            onClose={documents.clearMessage}
            sx={{ bgcolor: colors.surface, color: colors.text, maxWidth: 480 }}
          >
            {documents.message.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}

export default App;
