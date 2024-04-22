import { Navigate } from 'react-router-dom';

import Login from '../auth/Login';
import SignUp from '../auth/SignUp';
import ForgotPassword from '../auth/ForgotPassword';
import VerifyOtp from '../auth/VerifyOtp';
import PhoneDetails from '../auth/PhoneDetails';

const AUTH_ROTUES = [
  {
    path: '',
    element: <Navigate to="/login" />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'sign-up',
    element: <SignUp />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'verify-sign-up-otp',
    element: <VerifyOtp />,
  },
  {
    path: 'phone-details',
    element: <PhoneDetails />,
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
];

export default AUTH_ROTUES;
