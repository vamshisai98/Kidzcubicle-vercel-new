import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { validateRequired } from '../../common/utils/Validation';

import { validateNumber } from '../../common/utils/Validation';
import { MuiOtpInput } from 'mui-one-time-password-input';

import Title from '../../common/components/Title';
import forgotPasswordOTPLogo from '../../assets/Images/forgotPasswordOtp.svg';
import './ForgotPasswordOTP.scss';
import '../../styles/common/Common.scss';
import SubTitle from '../../common/components/SubTitle';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setCurrentStep } from '../../store/slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { AuthStepKeys } from '../../common/utils/AuthUtils';
import { useSelector } from 'react-redux';

const ForgotPasswordOTP = ({ email }) => {
  const { cognitoUser } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [disableResendOtp, setDisableOtp] = useState(true);
  const [timer, setTimer] = useState(60);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');

  async function handleValidateOTP() {
    // setLoading(true);
    const verificationCode = otp;
    cognitoUser.confirmPassword(verificationCode, 'Test@234', {
      onSuccess: (res) => {
        console.log(res);
        // setLoading(false);
      },
      onFailure: (err) => {
        console.log(err);
        // setLoading(false);
        setErrorMessage(err.message || JSON.stringify(err));
      },
    });
  }

  const handleBackToResetPassword = () => {
    dispatch(
      setCurrentStep({
        currentStep: AuthStepKeys.RESET_PASSWORD,
      })
    );
  };

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOtpComplete = (finalValue) => {
    console.log('OTP:', finalValue);
  };

  // const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTimer = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (timer === 0) {
      setDisableOtp(false);
    }
  }, [timer]);

  const resendOtp = (successCallback) => {
    if (!cognitoUser) {
      setErrorMessage('Cognito user is not initialized.');
      return;
    }
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        console.log(err);
        setErrorMessage(err.message || JSON.stringify(err));
        return;
      }
      if (typeof successCallback === 'function') {
        successCallback();
      }
    });
  };

  return (
    <Grid
      container
      className="ForgotPasswordOTP--form-container"
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
        className="ForgotPasswordOTP__title"
        item
        xs={12}
      >
        <Box textAlign={'center'}>
          <img
            src={forgotPasswordOTPLogo}
            alt="forgot-password"
          />
          <Box my={1}>
            <Title name="Enter One Time Password" />
          </Box>
          <SubTitle name="We have sent you One Time Password to your phone" />
        </Box>
      </Grid>
      <Box className="ForgotPasswordOtp__timer">{timer > 0 && formatTimer(timer)}</Box>
      <Grid
        className="ForgotPasswordOTP__form"
        item
        xs={12}
      >
        <MuiOtpInput
          value={otp}
          onChange={handleOtpChange}
          onComplete={handleOtpComplete}
          length={6}
          autoFocus
          validateChar={validateNumber}
          TextFieldsProps={{}}
        />
      </Grid>
      <Grid
        className="ForgotPasswordOTP__buttons"
        item
        xs={12}
      >
        <Button
          className="Common__Login-btn"
          fullWidth
          color="primary"
          variant="contained"
          sx={{ color: Colors.WHITE_COLOR }}
          disabled={otp.length < 6}
          onClick={handleValidateOTP}
        >
          Verify
        </Button>
        <Button
          className="Common__Login-btn"
          fullWidth
          color="primary"
          variant="outlined"
          disabled={disableResendOtp}
          sx={{ margin: '1rem 0' }}
          onClick={() => {
            setTimer(60);
            setDisableOtp(true);
            resendOtp();
          }}
        >
          Resend OTP
        </Button>

        <Typography
          className="ForgotPasswordOTP__back-to-btn"
          onClick={handleBackToResetPassword}
        >
          <ArrowBackIcon
            fontSize="small"
            mx={2}
          />
          <span>Back</span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordOTP;
