import Box from '@mui/material/Box';

import Logo from '../assets/Images/logo.jpg';
import './Logo.scss';

const PublicLogo = () => (
  <Box className="Logo--container">
    <img
      src={Logo}
      alt="logo"
      className="Logo__image-logo"
    />
  </Box>
);

export default PublicLogo;
