import { Navigate } from 'react-router-dom';

import Dashboard from '../features/Dashboard';

const USER_ROUTES = [
  {
    path: '',
    element: <Navigate to="dashboard" />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
];

export default USER_ROUTES;
