import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Colors from '../../theme/KidzCubicleTheme/Colors';
import GoogleLogo from '../../assets/Images/google.svg';
import FacebookLogo from '../../assets/Images/facebook.svg';
import awsConfig from '../../aws/aws-config';
import { useGoogleLogin } from '@react-oauth/google';
import { checkIfFacebookUserExists, checkIfGoogleUserExists } from '../../aws/cognito-helper';
import { useDispatch } from 'react-redux';
import {
  setAccessToken,
  setCognitoUser,
  setFacebookUserDetails,
  setGoogleUserDetails,
} from '../../store/slices/AuthSlice';
import { useLogin } from 'react-facebook';
import AWS from 'aws-sdk';

const SocialSignUpBtns = ({ OnError }) => {
  const dispatch = useDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const { login } = useLogin();

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const getFacebookUserEmail = async (accessToken) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=email&access_token=${accessToken}`);
      console.log(response);
      const userInfo = await response.json();
      dispatch(
        setFacebookUserDetails({
          facebookUser: userInfo,
        })
      );
      return {
        email: userInfo.email,
      };
    } catch (error) {
      OnError(error.message || JSON.stringify(error));
      console.log('Error fetching user email:', error);
      return null;
    }
  };

  async function facebookLogin() {
    setIsFacebookLoading(true);
    try {
      const response = await login({
        scope: 'email',
      });
      console.log(response);
      if (response.status === 'connected') {
        const userEmail = await getFacebookUserEmail(response.authResponse.accessToken);
        console.log(userEmail);
        if (userEmail.email !== undefined && userEmail.email !== null && userEmail.email !== '') {
          const userExists = await checkIfFacebookUserExists(userEmail.email);
          if (!userExists) {
            OnError('Email already exists');
            setIsFacebookLoading(false);
          } else {
            dispatch(
              setCognitoUser({
                cognitoUser: null,
              })
            );
            window.location.href = `https://${awsConfig.cognito.Domain}/oauth2/authorize?identity_provider=${awsConfig.social.Facebook.IdentityProvider}&redirect_uri=${awsConfig.redirect.Dashboard}&response_type=CODE&client_id=${awsConfig.cognito.ClientId}`;
            if (
              window.location.href ===
              `https://${awsConfig.cognito.Domain}/oauth2/authorize?identity_provider=${awsConfig.social.Facebook.IdentityProvider}&redirect_uri=${awsConfig.redirect.Dashboard}&response_type=CODE&client_id=${awsConfig.cognito.ClientId}`
            ) {
              dispatch(setAccessToken({ token: response.authResponse.accessToken }));
            }
          }
        }
      }
    } catch (error) {
      setIsFacebookLoading(false);
      OnError(error.message || JSON.stringify(error));
    }
  }

  const getGoogleUserEmail = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo, 'USER_INFO');
        dispatch(
          setGoogleUserDetails({
            googleUser: userInfo,
          })
        );
        dispatch(
          setCognitoUser({
            cognitoUser: null,
          })
        );

        // try {
        //   await cognito
        //     .adminCreateUser({
        //       UserPoolId: awsConfig.cognito.UserPoolId, // Replace with your Cognito User Pool ID
        //       Username: userInfo.email,
        //       UserAttributes: [
        //         {
        //           Name: 'email',
        //           Value: userInfo.email,
        //         },
        //         {
        //           Name: 'email_verified',
        //           Value: 'true',
        //         },
        //         {
        //           Name: 'phone_number',
        //           Value: '+910000000000',
        //         },
        //         {
        //           Name: 'phone_number_verified',
        //           Value: 'true',
        //         },
        //       ],
        //       MessageAction: 'SUPPRESS', // Suppresses the welcome message
        //     })
        //     .promise();

        //   const userCognito = await cognito
        //     .adminGetUser({
        //       UserPoolId: awsConfig.cognito.UserPoolId, // Replace with your Cognito User Pool ID
        //       Username: userInfo.email,
        //     })
        //     .promise();

        //   dispatch(
        //     setCognitoUser({
        //       cognitoUser: userCognito,
        //     })
        //   );

        //   console.log('User created and confirmed in Cognito', userCognito);
        // } catch (error) {
        //   console.error('An error occurred:', error);
        // }

        // Check if the user's phone number is not already '+910000000000'
        // if (user.UserAttributes.some((attr) => attr.Name === 'phone_number' && attr.Value === '+910000000000')) {
        //   // Force confirm the user
        //   await cognito
        //     .adminConfirmSignUp({
        //       UserPoolId: awsConfig.cognito.UserPoolId, // Replace with your Cognito User Pool ID
        //       Username: userInfo.email, // Replace with the user's email
        //     })
        //     .promise();
        //   // Update user's phone number in Cognito
        //   await cognito
        //     .adminUpdateUserAttributes({
        //       UserPoolId: awsConfig.cognito.UserPoolId,
        //       Username: userInfo.email,
        //       UserAttributes: [
        //         {
        //           Name: 'phone_number',
        //           Value: '+910000000000',
        //         },
        //       ],
        //     })
        //     .promise();
        // }

        return {
          email: userInfo.email,
        };
      } else {
        OnError(response.statusText);
        console.error('Error fetching user info:');
        return null;
      }
    } catch (error) {
      OnError(error.message || JSON.stringify(error));
      return null;
    }
  };

  const handleGoogleLogin = async (codeResponse) => {
    setIsGoogleLoading(true);
    try {
      const googleToken = codeResponse.access_token;
      const userEmail = await getGoogleUserEmail(googleToken);

      if (userEmail.email !== undefined && userEmail.email !== null && userEmail.email !== '') {
        const userExists = await checkIfGoogleUserExists(userEmail.email);

        if (!userExists) {
          OnError('Email already exists');
          setIsGoogleLoading(false);
        } else {
          dispatch(
            setCognitoUser({
              cognitoUser: null,
            })
          );
          window.location.href = `https://${awsConfig.cognito.Domain}/oauth2/authorize?identity_provider=${awsConfig.social.Google.IdentityProvider}&redirect_uri=${awsConfig.redirect.Dashboard}&response_type=CODE&client_id=${awsConfig.cognito.ClientId}&scope=aws.cognito.signin.user.admin openid email profile`;
          if (
            window.location.href ===
            `https://${awsConfig.cognito.Domain}/oauth2/authorize?identity_provider=${awsConfig.social.Google.IdentityProvider}&redirect_uri=${awsConfig.redirect.Dashboard}&response_type=CODE&client_id=${awsConfig.cognito.ClientId}&scope=aws.cognito.signin.user.admin openid email profile`
          ) {
            dispatch(setAccessToken({ token: googleToken }));
          }
        }
      } else {
        console.log('Failed to retrieve user email.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onFailure: (err) => console.log(err),
  });

  return (
    <div>
      <Button
        fullWidth
        variant="raised"
        onClick={googleLogin}
        className="Common__Login-btn"
        sx={{
          color: Colors.GREY_COLOR_1,
          background: Colors.GREY_COLOR_2,
        }}
      >
        {!isGoogleLoading ? (
          <Box className="Login__google-btn">
            <img
              src={GoogleLogo}
              alt="Google"
              height={25}
              width={25}
            />
            Sign in with Google
          </Box>
        ) : (
          <CircularProgress size={32} />
        )}
      </Button>

      <Button
        fullWidth
        variant="variant"
        onClick={facebookLogin}
        className="Common__Login-btn"
        sx={{
          color: Colors.LIGHT_BLUE,
          background: 'none',
          border: '1px solid' + Colors.LIGHT_BLUE,
          margin: '1rem 0',
        }}
      >
        {!isFacebookLoading ? (
          <Box className="Login__google-btn">
            <img
              src={FacebookLogo}
              alt="Facebook"
              height={25}
              width={25}
            />
            Sign in with Facebook
          </Box>
        ) : (
          <CircularProgress size={32} />
        )}
      </Button>
    </div>
  );
};

SocialSignUpBtns.propTypes = {
  OnError: PropTypes.func.isRequired,
};

export default SocialSignUpBtns;
