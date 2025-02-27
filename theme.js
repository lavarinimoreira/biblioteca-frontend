import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#52796f',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0077b6',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#fefae0',
      paper: '#ccd5ae'
    },
    text: {
      primary: '#283618',
      secondary: '#606c38',
    },
  },
  typography: {
    fontFamily: '"Geist", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none', // Remove o sublinhado dos links
        },
      },
    },
  },
});

export default theme;
