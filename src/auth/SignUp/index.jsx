import React, { useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import '../../styles/common/Common.scss';

import Title from '../../common/components/Title';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Alert from '@mui/material/Alert';

import './SignUp.scss';
import SubTitle from '../../common/components/SubTitle';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { SIGN_UP_FORM_INITIAL_VALUES, signUpSchema } from '../../common/utils/AuthUtils';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import CountryCodeList from '../../common/components/CountryCodeList';
import { validateRequired } from '../../common/utils/Validation';
import { checkIfUserExists, userPool } from '../../aws/cognito-helper';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { useDispatch } from 'react-redux';
import { setCognitoUser } from '../../store/slices/AuthSlice';

import SocialSignUpBtns from '../SocialSignUpBtns';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const getErrorMessage = (error) => {
    setErrorMessage(error);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleSignUp = async (values) => {
    const { name, mobile, email, password, countryCode } = values;
    const phone = countryCode && countryCode?.value + mobile;
    console.log(phone, 'Phnoe');
    setIsLoading(true);
    setErrorMessage('');
    try {
      const emailExists = await checkIfUserExists('email', email);
      if (emailExists) {
        setIsLoading(false);
        setErrorMessage('Email already exists');
        return;
      }

      const phoneExists = await checkIfUserExists('phone_number', phone);
      if (phoneExists) {
        setIsLoading(false);
        setErrorMessage('Phone number already exists');
        return;
      }

      if (!phoneExists && !emailExists && name && phone && email) {
        const attributeList = [
          new CognitoUserAttribute({
            Name: 'email',
            Value: email,
          }),
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phone,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ];

        userPool.signUp(email, password, attributeList, null, (error, result) => {
          if (error) {
            setIsLoading(false);
            setErrorMessage(error.message || JSON.stringify(error));
          } else {
            console.log(result.user, 'RES');
            dispatch(
              setCognitoUser({
                cognitoUser: result.user,
              })
            );

            setIsLoading(false);
            navigate('/verify-sign-up-otp');
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || JSON.stringify(error));
    }
  };

  return (
    <Formik
      initialValues={SIGN_UP_FORM_INITIAL_VALUES}
      validationSchema={signUpSchema}
      onSubmit={(values, { resetForm }) => {
        // handle form submission here
        handleSignUp(values, { resetForm });
      }}
    >
      {({ values, errors }) => (
        <Form>
          <Grid
            container
            className="SignUp--form-container"
          >
            <Grid
              className="SignUp__title"
              item
              xs={12}
              textAlign={'center'}
            >
              <Title name="Join Our Community! Sign Up" />
              <Box mt={2}>
                <SubTitle name="We make sure that your child's journey with us is safe, enjoyable, and filled with learning adventures." />
              </Box>
            </Grid>
            <Grid
              className="SignUp__form"
              item
              xs={12}
            >
              <Box my={4}>
                <Field
                  name="name"
                  as={TextField}
                  label="Name"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="Common__error-message"
                />
              </Box>
              <Grid
                container
                my={4}
                gap={2}
              >
                <Grid
                  item
                  xs={4}
                >
                  <Field name="countryCode">
                    {({ field, form }) => {
                      return (
                        <div>
                          <CountryCodeList
                            onSelectChange={(selectedOption) => {
                              form.setFieldValue('countryCode', selectedOption);
                            }}
                            countryCode={field.value}
                          />
                          {form.errors.countryCode ? (
                            <div className="Common__error-message">{form.errors.countryCode}</div>
                          ) : null}
                        </div>
                      );
                    }}
                  </Field>
                </Grid>
                <Grid
                  item
                  xs
                >
                  <Field
                    name="mobile"
                    as={TextField}
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      maxLength: 10,
                      onInput: (event) => {
                        event.target.value = event.target.value.replace(/[^0-9]/g, '');
                      },
                    }}
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="Common__error-message"
                  />
                </Grid>
              </Grid>
              <Box>
                <Field
                  autoComplete="username"
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="Common__error-message"
                />
              </Box>

              <Box mt={4}>
                <Field name="password">
                  {({ field }) => (
                    <FormControl
                      sx={{ m: 1, margin: '0' }}
                      variant="outlined"
                      fullWidth
                    >
                      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                      <OutlinedInput
                        {...field}
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        id="outlined-adornment-password"
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
                        label="Password"
                      />
                    </FormControl>
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="Common__error-message"
                />
              </Box>

              <Box mt={4}>
                <Field name="confirmPassword">
                  {({ field }) => (
                    <FormControl
                      sx={{ m: 1, margin: '0' }}
                      variant="outlined"
                      fullWidth
                    >
                      <InputLabel htmlFor="outlined-adornment-new-password">Confirm Password</InputLabel>
                      <OutlinedInput
                        autoComplete="new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        id="outlined-adornment-new-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Confirm Password"
                      />
                    </FormControl>
                  )}
                </Field>

                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="Common__error-message"
                />

                <Box m={2}>
                  <FormControlLabel
                    sx={{ alignItems: 'flex-start' }}
                    control={
                      <Checkbox
                        sx={{ padding: 0, marginRight: 1 }}
                        defaultChecked
                        size="small"
                      />
                    }
                    label={
                      <Typography style={{ fontSize: '0.9rem' }}>
                        I agree to KidzCubicle <span style={{ color: Colors.PRIMARY }}>Terms and Conditions</span> and{' '}
                        <span>Privacy Policy.</span>
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid
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
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
                disabled={
                  !values.name ||
                  !values.mobile ||
                  !values.email ||
                  !values.password ||
                  !values.confirmPassword ||
                  !values.countryCode ||
                  Object.keys(errors).length > 0
                }
                onClick={handleSignUp}
                className="Common__Login-btn"
                sx={{ mt: 1, color: Colors.WHITE_COLOR }}
              >
                {!isLoading ? 'SignUp' : <CircularProgress size={32} />}
              </Button>
              <Divider className="SignUp__Divider">Or Sign in with</Divider>
              <Grid>
                <SocialSignUpBtns OnError={getErrorMessage} />
              </Grid>
              <Box textAlign={'center'}>
                <small style={{ color: Colors.INPUT_TEXT_COLOR }}>
                  Already have an account?
                  <b
                    style={{ color: Colors.PRIMARY, cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </b>
                </small>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
