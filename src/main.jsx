import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000000', paper: '#0a0a0a' },
    primary: { main: '#ededed' },
    text: { primary: '#ededed', secondary: '#a1a1a1' },
    divider: '#1f1f1f',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
