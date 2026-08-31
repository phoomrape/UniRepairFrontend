import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8', // Stitch Modern Blue
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0284c7', // Sky Blue
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Light slate gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    status: {
      pending: '#f59e0b',       // Amber
      accepted: '#0284c7',      // Sky Blue
      inProgress: '#2563eb',    // Bright Blue
      waitingParts: '#d97706',  // Orange
      completed: '#10b981',     // Emerald
      cancelled: '#ef4444',     // Red
    }
  },
  typography: {
    fontFamily: '"Inter", "Prompt", "Sarabun", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
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
          padding: '8px 18px',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1d4ed8',
          '&:hover': {
            backgroundColor: '#1e40af',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 14,
        },
      },
    },
  },
});

export default theme;
