import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { validateEmail } from '../../common/utils/Validation';
import Title from '../../common/components/Title';
import forgotPasswordLogo from '../../assets/Images/forgotPassword.svg';
import './ForgotPassword.scss';
import '../../styles/common/Common.scss';
import SubTitle from '../../common/components/SubTitle';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setCognitoUser, setCurrentStep } from '../../store/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStepKeys } from '../../common/utils/AuthUtils';
import { validateRequired } from '../../common/utils/Validation';
import ForgotPasswordOTP from './ForgotPasswordOTP';
import ResetPassword from './ResetPassword';
import Alert from '@mui/material/Alert';
import {
  checkIfUserExistsGetEmail,
  checkIfUserExists,
  checkIfUserLinkedToSocialProvider,
  checkIfUserExistsGetEmailPassword,
} from '../../aws/cognito-helper';
import awsConfig from '../../aws/aws-config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { currentStep } = useSelector((state) => state.auth);

  const handleForgotPassword = async () => {
    // setLoading(true);
    try {
      const userExists = await checkIfUserExists('email', email);

      if (!userExists) {
        // setLoading(false);
        setErrorMessage('User does not exist.');
        return;
      }
      const socialUserCheck = await checkIfUserLinkedToSocialProvider('email', email);
      if (socialUserCheck) {
        // setLoading(false);
        setErrorMessage('This account is linked to a social provider. Please sign in using that provider.');
        return;
      }

      const userEmail = await checkIfUserExistsGetEmail('email', email);

      const userPool = new CognitoUserPool({
        UserPoolId: awsConfig.cognito.UserPoolId,
        ClientId: awsConfig.cognito.ClientId,
      });
      const userData = {
        Username: userEmail,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      console.log(cognitoUser, 'CG');
      await checkIfUserExistsGetEmailPassword('email', email);
      dispatch(
        setCurrentStep({
          currentStep: AuthStepKeys.RESET_PASSWORD,
        })
      );
      dispatch(
        setCognitoUser({
          cognitoUser: cognitoUser,
        })
      );
      // setStep(2);
      // setLoading(false);
    } catch (error) {
      console.error(error);
      // setLoading(false);
      setErrorMessage(error.message || 'An error occurred while processing your request.');
    }
  };

  return (
    <>
      {currentStep === AuthStepKeys.VERIFY_EMAIL && (
        <Grid
          container
          className="ForgotPassword--form-container"
        >
          {validateRequired(errorMessage) && (
            <Grid
              item
              xs={12}
              mb={2}
            >
              <Alert severity="error">{errorMessage}</Alert>
            </Grid>
          )}
          <Grid
            className="ForgotPassword__title"
            item
            xs={12}
          >
            <Box textAlign={'center'}>
              <img
                src={forgotPasswordLogo}
                alt="forgot-password"
              />
              <Box my={2}>
                <Title name="Forgot Password" />
              </Box>
              <SubTitle name="Enter your Email so that OTP can be sent to the registered mobile number." />
            </Box>
          </Grid>
          <Grid
            className="ForgotPassword__form"
            item
            xs={12}
          >
            <Box>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!(email.length > 0 && !validateEmail(email))}
                helperText={email.length > 0 && !validateEmail(email) ? 'Enter a valid email' : ''}
              />
            </Box>
          </Grid>
          <Grid
            className="ForgotPassword__buttons"
            item
            xs={12}
          >
            <Button
              className="Common__Login-btn"
              fullWidth
              color="primary"
              variant="contained"
              sx={{ color: Colors.WHITE_COLOR }}
              disabled={email.length === 0 || !validateEmail(email)}
              onClick={handleForgotPassword}
            >
              Next
            </Button>

            <Typography
              className="ForgotPassword__back-to-btn"
              onClick={() => {
                navigate('/login');
              }}
            >
              <ArrowBackIcon
                fontSize="small"
                mx={2}
              />
              <span>Back to Log in</span>
            </Typography>
          </Grid>
        </Grid>
      )}

      {currentStep === AuthStepKeys.VERIFY_OTP && <ForgotPasswordOTP email={email} />}
      {currentStep === AuthStepKeys.RESET_PASSWORD && <ResetPassword onForgotPassword={handleForgotPassword} />}
    </>
  );
};

export default ForgotPassword;
