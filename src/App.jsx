import { ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';

import KidzCubicleTheme from './theme/KidzCubicleTheme';
import Routes from './routes';

import './App.scss';

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const routing = useRoutes(Routes(token));

  return <ThemeProvider theme={KidzCubicleTheme}>{routing}</ThemeProvider>;
};

export default App;
