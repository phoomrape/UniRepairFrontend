import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Navy Blue
      light: '#3b82f6',
      dark: '#1e1b4b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d9488', // Teal
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    status: {
      pending: '#f59e0b',       // Amber / Orange
      accepted: '#0284c7',      // Sky Blue
      inProgress: '#8b5cf6',    // Purple
      waitingParts: '#d97706',  // Dark Amber
      completed: '#10b981',     // Emerald Green
      cancelled: '#ef4444',     // Red
    }
  },
  typography: {
    fontFamily: '"Prompt", "Sarabun", "Inter", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
