import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { validateRequired } from '../../common/utils/Validation';

import { validateNumber } from '../../common/utils/Validation';
import { MuiOtpInput } from 'mui-one-time-password-input';

import Title from '../../common/components/Title';
import VerifyOtpLogo from '../../assets/Images/forgotPassword.svg';
import './VerifyOtp.scss';
import '../../styles/common/Common.scss';
import SubTitle from '../../common/components/SubTitle';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';

const VerifyOtp = () => {
  const { cognitoUser } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [disableResendOtp, setDisableOtp] = useState(true);
  const [timer, setTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateOTP = () => {
    setLoading(true);
    console.log(cognitoUser, 'cognitoUser');
    if (!cognitoUser) {
      setErrorMessage('Cognito user is not initialized.');
      setLoading(false);
      return;
    }
    cognitoUser.confirmRegistration(otp, true, (err, session) => {
      console.log(err, session);
      if (err) {
        setLoading(false);
        setErrorMessage(err.message || JSON.stringify(err));
        console.error(err);
      } else {
        setLoading(false);
        setInterval(() => {
          setErrorMessage('');
          navigate('/login');
        }, 2000);
      }
    });
  };

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

  const handleBackToVerifyEmail = () => {
    navigate('/sign-up');
  };

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOtpComplete = (finalValue) => {
    console.log('OTP:', finalValue);
  };

  const navigate = useNavigate();

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

  return (
    <Grid
      container
      className="VerifyOtp--form-container"
    >
      <Grid
        className="VerifyOtp__title"
        item
        xs={12}
      >
        <Box textAlign={'center'}>
          <img
            src={VerifyOtpLogo}
            alt="forgot-password"
          />
          <Box my={1}>
            <Title name="Enter One Time Password" />
          </Box>
          <SubTitle name="We have sent you One Time Password to your phone" />
        </Box>
      </Grid>
      <Box className="VerifyOtp__timer">{timer > 0 && formatTimer(timer)}</Box>
      <Grid
        className="VerifyOtp__form"
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
        className="VerifyOtp__buttons"
        item
        xs={12}
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
        <Button
          className="Common__Login-btn"
          fullWidth
          color="primary"
          variant="contained"
          sx={{ color: Colors.WHITE_COLOR }}
          disabled={otp.length < 6}
          onClick={handleValidateOTP}
        >
          {!loading ? 'Verify' : <CircularProgress size={32} />}
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
          className="VerifyOtp__back-to-btn"
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
  );
};

export default VerifyOtp;
