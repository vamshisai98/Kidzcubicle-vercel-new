import React from 'react';
import PublicLogo from '../../../logo/PublicLogo';
import { Grid, Box } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './Navbar.scss';

const Navbar = () => {
  return (
    <Grid
      container
      alignItems="center"
      className="Navbar--container"
    >
      <Grid>
        <PublicLogo />
      </Grid>

      <Grid
        item
        xs={3}
        display="flex"
        justifyContent="flex-end"
        className="Navbar--links"
      >
        <Box p={2}>
          <ShoppingCartOutlinedIcon />
        </Box>
        <Box p={2}>
          <LogoutOutlinedIcon />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Navbar;
