import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { validateRequired } from '../../common/utils/Validation';
import TextField from '@mui/material/TextField';
import awsConfig from '../../aws/aws-config';

import Title from '../../common/components/Title';
import PhoneDetailsLogo from '../../assets/Images/phone.svg';
import './PhoneDetails.scss';
import '../../styles/common/Common.scss';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import CountryCodeList from '../../common/components/CountryCodeList';
import { PHONE_INITIAL_VALUES, phoneSchema } from '../../common/utils/AuthUtils';
import {
  cognitoIdentityServiceProvider,
  // cognitoIdentityServiceProviderUser,
  // getUserDetailsByEmail,
} from '../../aws/cognito-helper';

const PhoneDetails = () => {
  const { cognitoUser } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    countryCode: '',
    mobile: '',
  });

  console.log(values, 'values');

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

  // const updatePhoneNumber = async () => {
  //   try {
  //     if (googleUser) {
  //       const userIdInfo = googleUser.find((attr) => attr.Name === 'sub');
  //       const userEmail = googleUser.find((attr) => attr.Name === 'email');

  //       if (userIdInfo) {
  //         const params = {
  //           UserAttributes: [
  //             {
  //               Name: 'phone_number',
  //               Value: values.countryCode?.value + values?.mobile || '', // Replace with the new phone number
  //             },
  //           ],
  //           UserPoolId: awsConfig.cognito.UserPoolId,
  //           Username: userIdInfo.Value,
  //         };

  //         const data = await cognitoIdentityServiceProviderUser.adminUpdateUserAttributes(params).promise();
  //         console.log('Phone number updated successfully:', data);
  //         const getUserFullDetails = await getUserDetailsByEmail(userEmail.Value);
  //         console.log(getUserFullDetails, 'GET');
  //         navigate('/verify-sign-up-otp');
  //         return data;
  //       } else {
  //         console.error('User ID (sub) not found in Google user attributes');
  //         throw new Error('User ID (sub) not found in Google user attributes');
  //       }
  //     } else {
  //       console.error('Google user object is null or undefined');
  //       throw new Error('Google user object is null or undefined');
  //     }
  //   } catch (error) {
  //     console.error('Error updating phone number:', error);
  //     throw error;
  //   }
  // };

  const handleBackToVerifyEmail = () => {
    navigate('/sign-up');
  };

  const navigate = useNavigate();

  const sendOTP = async () => {
    const params = {
      ClientId: awsConfig.cognito.ClientId, // Specify your Cognito User Pool client ID
      Username: values.countryCode?.value + values?.mobile || '',
    };

    try {
      const data = await cognitoIdentityServiceProvider.resendConfirmationCode(params).promise();
      console.log('OTP sent successfully:', data);
      navigate('/verify-sign-up-otp');
      return data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={PHONE_INITIAL_VALUES}
      validationSchema={phoneSchema}
      onSubmit={(values, { resetForm }) => {
        // handle form submission here
        // handleSignUp(values, { resetForm });
      }}
    >
      {({ values, errors }) => (
        <Form>
          <Grid
            container
            className="PhoneDetails--form-container"
          >
            <Grid
              className="PhoneDetails__title"
              item
              xs={12}
            >
              <Box textAlign={'center'}>
                <img
                  src={PhoneDetailsLogo}
                  alt="forgot-password"
                />
                <Box my={1}>
                  <Title name="Enter Phone Number" />
                </Box>
              </Box>
            </Grid>
            <Grid
              className="PhoneDetails__form"
              item
              xs={12}
            >
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
                              setValues({ ...values, countryCode: selectedOption });
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
                        setValues({ ...values, mobile: event.target.value });
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
            </Grid>
            <Grid
              className="PhoneDetails__buttons"
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
                disabled={!values.mobile || !values.countryCode || Object.keys(errors).length > 0}
                onClick={sendOTP}
              >
                Verify
              </Button>
              <Button
                className="Common__Login-btn"
                fullWidth
                color="primary"
                variant="outlined"
                sx={{ margin: '1rem 0' }}
                onClick={() => {
                  resendOtp();
                }}
              >
                Resend OTP
              </Button>

              <Typography
                className="PhoneDetails__back-to-btn"
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
      )}
    </Formik>
  );
};

export default PhoneDetails;
