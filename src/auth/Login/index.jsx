import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { validateRequired } from '../../common/utils/Validation';
import { useDispatch } from 'react-redux';
import { setAccessToken, setCurrentStep } from '../../store/slices/AuthSlice';
import { AuthStepKeys } from '../../common/utils/AuthUtils';
import Title from '../../common/components/Title';

import '../../styles/common/Common.scss';
import './Login.scss';
import SubTitle from '../../common/components/SubTitle';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import { authenticateUser } from '../../aws/cognito-helper';
import SocialSignInLoginBtns from '../SocialSignInLoginBtns';

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    setErrorMessage(error);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSetToVerifyEmail = () => {
    dispatch(
      setCurrentStep({
        currentStep: AuthStepKeys.VERIFY_EMAIL,
      })
    );
  };

  const isValidForm = useMemo(() => {
    if (validateRequired(username) && validateRequired(password)) {
      return false;
    }
    return true;
  }, [password, username]);

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      const user = authenticateUser(username, password, {
        onSuccess: (session) => {
          sessionStorage.setItem('access_token', session.getAccessToken().getJwtToken());
          localStorage.setItem('id_token', session.getIdToken().getJwtToken());
          localStorage.setItem('access_token', session.getAccessToken().getJwtToken());
          localStorage.setItem('refresh_token', session.getRefreshToken().getToken());
          dispatch(
            setAccessToken({
              token: session.getAccessToken().getJwtToken(),
            })
          );
          setIsLoading(false);
          navigate('/user/dashboard', { replace: true });
        },
        onFailure: (err) => {
          if (err.code === 'UserNotConfirmedException') {
            setIsLoading(false);
          } else {
            setErrorMessage(err.message || JSON.stringify(err));
          }
        },
        mfaSetup: () => alert('MFA SETUP'),
        selectMFAType: () => alert('MFA SELECT'),
        mfaRequired: () => alert('MFA REQUIRED'),
        totpRequired: () => alert('TOTP REQUIRED'),
      });
      setIsLoading(false);

      console.log(user, 'USER');
    } catch (error) {
      console.log('Authentication error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Grid
      container
      className="Login--form-container"
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
        className="Login__title"
        item
        xs={12}
        textAlign={'center'}
      >
        <Title name="Welcome Back! Sign In" />
        <Box mt={2}>
          <SubTitle name="We make sure that your child's journey with us is safe, enjoyable, and filled with learning adventures." />
        </Box>
      </Grid>
      <Grid
        className="Login__form"
        item
        xs={12}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          disabled={isLoading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={username.length > 0 && !validateRequired(username)}
          helperText={username.length > 0 && !validateRequired(username) ? 'Enter a valid username' : ''}
        />
        <Box mt={5}>
          <form>
            <FormControl
              sx={{ m: 1, margin: '0' }}
              variant="outlined"
              fullWidth
            >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                autoComplete="new-password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                fullWidth
                label="Password"
                disabled={isLoading}
              />
            </FormControl>
          </form>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Stack
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            variant="text"
            disabled={isLoading}
            className="Login__link-to-btn"
            onClick={() => {
              handleSetToVerifyEmail();
              navigate('/forgot-password');
            }}
          >
            Forgot Password?
          </Button>
        </Stack>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          disabled={isValidForm || isLoading}
          onClick={handleSignIn}
          className="Common__Login-btn"
          sx={{
            color: 'white',
          }}
        >
          {!isLoading ? 'Sign In' : <CircularProgress size={32} />}
        </Button>
        <Divider className="Login__Divider">Or Sign in with</Divider>

        <SocialSignInLoginBtns OnError={getErrorMessage} />

        <Box textAlign={'center'}>
          <small style={{ color: Colors.INPUT_TEXT_COLOR }}>
            Don’t have an account yet?
            <b
              style={{ color: Colors.PRIMARY, cursor: 'pointer' }}
              onClick={() => navigate('/sign-up')}
            >
              Sign up
            </b>
          </small>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
