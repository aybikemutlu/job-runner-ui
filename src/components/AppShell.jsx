import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

export default function AppShell() {
  const { pathname } = useLocation();
  const active = p => pathname === p ? 'primary' : 'inherit';
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Job Runner UI</Typography>
          <Button component={Link} to="/" color={active('/')}>Dashboard</Button>
          <Button component={Link} to="/run-command" color={active('/run-command')}>Komut</Button>
          <Button component={Link} to="/run-crawler" color={active('/run-crawler')}>Crawler</Button>
          <Button component={Link} to="/runs" color={active('/runs')}>History</Button>
          <Button component={Link} to="/urls" color={active('/urls')}>URL’ler</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

