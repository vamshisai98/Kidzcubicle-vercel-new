import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Title from '../../common/components/Title';
import ResetPasswordLogo from '../../assets/Images/forgotPasswordOtp.svg';
import './ResetPassword.scss';
import '../../styles/common/Common.scss';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import { setCurrentStep } from '../../store/slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { AuthStepKeys, PASSWORD_RESET_INITIAL_VALUES, passwordResetSchema } from '../../common/utils/AuthUtils';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

const ResetPassword = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmNewPassword = (event) => {
    event.preventDefault();
  };

  const dispatch = useDispatch();

  const handleBackToVerifyEmail = () => {
    dispatch(
      setCurrentStep({
        currentStep: AuthStepKeys.VERIFY_EMAIL,
      })
    );
  };

  const handleCompleteResetPassword = (values, { resetForm }) => {
    onForgotPassword(values);
    dispatch(
      setCurrentStep({
        currentStep: AuthStepKeys.VERIFY_OTP,
      })
    );
    navigate('/login');
    console.log(values, 'Values');
    resetForm();
  };

  return (
    <Formik
      initialValues={PASSWORD_RESET_INITIAL_VALUES}
      validationSchema={passwordResetSchema}
      onSubmit={(values, { resetForm }) => {
        // handle form submission here
        handleCompleteResetPassword(values, { resetForm });
      }}
    >
      <Form>
        <Grid
          container
          className="ResetPassword--form-container"
        >
          <Grid
            className="ResetPassword__title"
            item
            xs={12}
          >
            <Box textAlign={'center'}>
              <img
                src={ResetPasswordLogo}
                alt="forgot-password"
              />
              <Box my={1}>
                <Title name="Set new password" />
              </Box>
            </Box>
          </Grid>
          <Grid
            className="ResetPassword__form"
            item
            xs={12}
          >
            <Box mt={4}>
              <Field
                name="newPassword"
                type="password"
              >
                {({ field }) => (
                  <FormControl
                    sx={{ m: 1, margin: '0' }}
                    variant="outlined"
                    fullWidth
                  >
                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                    <OutlinedInput
                      {...field}
                      type={showNewPassword ? 'text' : 'password'}
                      id="outlined-adornment-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                  </FormControl>
                )}
              </Field>
              <ErrorMessage
                name="newPassword"
                component="div"
                className="Common__error-message"
              />
            </Box>

            <Box mt={4}>
              <Field
                name="confirmNewPassword"
                type="password"
              >
                {({ field }) => (
                  <FormControl
                    sx={{ m: 1, margin: '0' }}
                    variant="outlined"
                    fullWidth
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
                    <OutlinedInput
                      {...field}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      id="outlined-adornment-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={handleMouseDownConfirmNewPassword}
                            edge="end"
                          >
                            {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm New Password"
                    />
                  </FormControl>
                )}
              </Field>

              <ErrorMessage
                name="confirmNewPassword"
                component="div"
                className="Common__error-message"
              />
            </Box>
          </Grid>
          <Grid
            className="ResetPassword__buttons"
            item
            xs={12}
          >
            <Button
              className="Common__Login-btn"
              fullWidth
              color="primary"
              variant="contained"
              sx={{ color: Colors.WHITE_COLOR }}
              type="submit"
            >
              {'Next'}
            </Button>
            <Typography
              className="ForgotPasswordOTP__back-to-btn"
              onClick={handleBackToVerifyEmail}
            >
              <ArrowBackIcon
                fontSize="small"
                mx={2}
              />
              <span>Back</span>
            </Typography>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

export default ResetPassword;
