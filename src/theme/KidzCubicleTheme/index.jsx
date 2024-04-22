import { createTheme } from '@mui/material/styles';

import Colors from './Colors';

const KidzCubicleTheme = createTheme({
  palette: {
    primary: {
      main: Colors.PRIMARY,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: '3rem',
          borderRadius: '0.5rem !important',
          color: Colors.INPUT_TEXT_COLOR,
        },
      },
    },
  },
});

export default KidzCubicleTheme;
