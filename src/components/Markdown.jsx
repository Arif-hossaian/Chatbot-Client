import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { colors, monoFont } from '../theme/colors';

const markdownSx = {
  fontSize: 15,
  lineHeight: 1.75,
  color: colors.text,
  wordBreak: 'break-word',
  '& > :first-of-type': { mt: 0 },
  '& > :last-child': { mb: 0 },
  '& p': { my: 1.5 },
  '& h1, & h2, & h3, & h4': { mt: 3, mb: 1, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' },
  '& h1': { fontSize: '1.5rem' },
  '& h2': { fontSize: '1.25rem' },
  '& h3': { fontSize: '1.1rem' },
  '& ul, & ol': { pl: 3, my: 1.5 },
  '& li': { my: 0.5 },
  '& li > p': { my: 0.5 },
  '& a': { color: '#93c5fd', textUnderlineOffset: '3px' },
  '& strong': { fontWeight: 600, color: '#ffffff' },
  '& blockquote': { m: 0, my: 1.5, pl: 2, borderLeft: `3px solid ${colors.borderStrong}`, color: colors.muted },
  '& hr': { border: 0, borderTop: `1px solid ${colors.border}`, my: 3 },
  '& code': {
    fontFamily: monoFont,
    fontSize: '0.875em',
    px: 0.75,
    py: 0.25,
    borderRadius: '6px',
    bgcolor: colors.active,
  },
  '& pre': {
    my: 2,
    p: 2,
    overflowX: 'auto',
    borderRadius: '12px',
    bgcolor: colors.sidebar,
    border: `1px solid ${colors.border}`,
    lineHeight: 1.6,
  },
  '& pre code': { p: 0, bgcolor: 'transparent', fontSize: 13.5 },
  '& table': { width: '100%', borderCollapse: 'collapse', my: 2, fontSize: 14 },
  '& th, & td': { border: `1px solid ${colors.border}`, px: 1.5, py: 1, textAlign: 'left' },
  '& th': { bgcolor: colors.surface, fontWeight: 600 },
};

// Blinking caret after the last block while tokens are still arriving.
const streamingCaretSx = {
  '& > :last-child::after': {
    content: '""',
    display: 'inline-block',
    width: '0.5em',
    height: '1.1em',
    ml: 0.5,
    verticalAlign: 'text-bottom',
    bgcolor: colors.text,
    animation: 'caret-blink 1s steps(1) infinite',
  },
};

const components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export function Markdown({ content, streaming }) {
  return (
    <Box sx={[markdownSx, streaming && streamingCaretSx]}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
