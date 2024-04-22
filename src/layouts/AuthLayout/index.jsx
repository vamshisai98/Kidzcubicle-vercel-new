import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import PublicLogo from '../../logo/PublicLogo';
import './AuthLayout.scss';
import Footer from '../../common/components/Footer';

const AuthLayout = () => (
  <Box className="AuthLayout">
    <Box
      className="AuthLayout__Header"
      mb={4}
    >
      <Grid
        item
        xs={12}
        className="AuthLayout__logo"
        textAlign={'center'}
      >
        <PublicLogo />
      </Grid>
      <Container
        maxWidth="sm"
        className="AuthLayout--container"
        sx={{ borderRadius: '1rem' }}
      >
        <Grid
          container
          className="AuthLayout__content"
        >
          <Grid
            item
            xs={12}
          >
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Footer />
  </Box>
);

export default AuthLayout;
