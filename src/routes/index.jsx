import { Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import AUTH_ROUTES from './LoginRoutes';
import USER_ROUTES from './UserRoutes';
import UserLayout from '../layouts/UserLayout';
const Routes = (token) => [
  {
    path: '/user',
    element: token ? <UserLayout /> : <Navigate to="/login" />,
    children: [...USER_ROUTES],
  },
  {
    path: '/',
    element: !token ? <AuthLayout /> : <Navigate to="/user" />,
    children: [...AUTH_ROUTES],
  },
];

export default Routes;
