import { createTheme } from "@mui/material";
import type { ThemeOptions } from "@mui/material/styles";


const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,                              // ← add this, important
    primary: { main: '#5b8fff' },
    background: {
      default: mode === 'dark' ? '#0d0f14' : '#f5f4f0',
      paper: mode === 'dark' ? '#13161e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e8e6e1' : '#1a1a1a',
      secondary: mode === 'dark' ? '#5a5f6e' : '#6b7280',
      disabled: mode === 'dark' ? '#3e4356' : '#9ca3af',
    },
    divider: mode === 'dark' ? '#1e2230' : '#e5e7eb',
    error: { main: '#ff5c5c' },        // ← form validation errors
  },
  typography: {
    fontFamily: '"DM Mono", monospace',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 }
      }
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 12 } }
    },
  }
})

export const getTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode))


