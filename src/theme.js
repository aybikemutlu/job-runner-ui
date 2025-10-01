import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7FE7E0' },
    secondary: { main: '#7CB8FF' },
    background: { default: '#F8FAFA', paper: '#FFFFFF' }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 12 } } }
  }
});

export default theme;
