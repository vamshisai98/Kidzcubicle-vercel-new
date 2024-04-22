import React from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';

const UserLayout = () => {
  return (
    <Box className="UserLayout">
      <Box
        component="main"
        className="UserLayout--outlet"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
