// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#52796f',       // Cor primária
      contrastText: '#ffffff' // Cor do texto sobre o primário
    },
    secondary: {
      main: '#0077b6',       // Cor secundária
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',       // Cor para erros
    },
    background: {
      default: '#fefae0',    // Cor de fundo padrão
      paper: '#ccd5ae'       // Fundo de componentes tipo "paper"
    },
    text: {
      primary: '#283618',    // Cor principal do texto
      secondary: '#606c38',  // Cor secundária do texto
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
  spacing: 8, // Multiplicador padrão para espaçamentos
  shape: {
    borderRadius: 8, // Raio de borda global para componentes
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
          textTransform: 'none', // Remove a transformação padrão de texto (maiúsculas)
          borderRadius: 8,       // Sobrescreve o borderRadius para botões
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',     // Remove a sombra padrão do AppBar
        },
      },
    },
  },
});

export default theme;

