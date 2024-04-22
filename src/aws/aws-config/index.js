const awsConfig = {
  cognito: {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Region: process.env.REACT_APP_REGION,
    Issuer: process.env.REACT_APP_ISSUER,
    Domain: process.env.REACT_APP_DOMAIN,
  },
  key: {
    AccessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    SecretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  },
  social: {
    Google: {
      ClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      ClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      IdentityProvider: 'Google',
    },
    Facebook: {
      ClientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
      ClientSecret: process.env.REACT_APP_FACEBOOK_CLIENT_SECRET,
      IdentityProvider: 'Facebook',
    },
  },
  redirect: {
    Signup: process.env.REACT_APP_SIGNUP_REDIRECT_URL,
    Login: process.env.REACT_APP_LOGIN_REDIRECT_URL,
    Logout: process.env.REACT_APP_LOGOUT_REDIRECT_URL,
    Dashboard: process.env.REACT_APP_DASHBOARD_REDIRECT_URL,
  },
  oauth2: {
    scope: process.env.REACT_APP_OAUTH2_SCOPE,
  },
};

export default awsConfig;
