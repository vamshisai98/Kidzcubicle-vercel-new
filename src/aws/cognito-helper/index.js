import axios from 'axios';
import awsConfig from '../aws-config/index';
const AWS = require('aws-sdk');
const AWS1 = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: awsConfig.cognito.UserPoolId,
  ClientId: awsConfig.cognito.ClientId,
});

export { userPool };

AWS.config.update({
  accessKeyId: awsConfig.key.AccessKeyId,
  secretAccessKey: awsConfig.key.SecretAccessKey,
  region: awsConfig.cognito.Region,
});

AWS1.config.update({
  region: awsConfig.cognito.Region,
});
export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
export const cognitoIdentityServiceProviderUser = new AWS1.CognitoIdentityServiceProvider();

export async function updateCognitoUserAttributes(accessToken, phone) {
  try {
    const params = {
      AccessToken: accessToken,
      UserAttributes: [{ Name: 'phone_number', Value: phone }],
    };
    return await cognitoIdentityServiceProviderUser.updateUserAttributes(params).promise();
  } catch (error) {
    return error;
  }
}

export async function verifyCode(otpValue, accessToken, attributeName) {
  try {
    const params = {
      AccessToken: accessToken,
      AttributeName: attributeName,
      Code: otpValue,
    };
    return await cognitoIdentityServiceProviderUser.verifyUserAttribute(params).promise();
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const authenticateUser = (username, password, callbackHandlers) => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, callbackHandlers);
  return cognitoUser;
};

export function createCognitoUser(key, value) {
  const userData = {
    Username: value,
    Pool: userPool,
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

export async function checkIfUserExists(attribute, value) {
  let filter;
  switch (attribute) {
    case 'email':
      filter = `email="${value}"`;
      break;
    case 'phone_number':
      filter = `phone_number="${value}"`;
      break;
    default:
      throw new Error('Invalid attribute');
  }

  const params = {
    UserPoolId: awsConfig.cognito.UserPoolId,
    Filter: filter,
  };

  const users = await cognitoIdentityServiceProvider.listUsers(params).promise();
  return users.Users.length > 0;
}

export async function checkIfUserExistsGetEmail(attribute, value) {
  let filter;
  switch (attribute) {
    case 'email':
      filter = `email="${value}"`;
      break;
    case 'phone_number':
      filter = `phone_number="${value}"`;
      break;
    default:
      throw new Error('Invalid attribute');
  }

  const params = {
    UserPoolId: awsConfig.cognito.UserPoolId,
    Filter: filter,
  };

  const users = await cognitoIdentityServiceProvider.listUsers(params).promise();
  const userAttributes = users.Users[0].Attributes;
  const emailAttribute = userAttributes.find((attr) => attr.Name === 'email');
  return emailAttribute.Value;
}

export async function checkIfGoogleUserExists(email) {
  try {
    const params = {
      UserPoolId: awsConfig.cognito.UserPoolId,
      Filter: `email="${email}"`,
    };
    const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
    console.log(data, 'data');
    if (data.Users.length === 0) {
      return true;
    }
    const userExists = data.Users.some((user) => {
      const userParts = user.Username.split('_');
      return userParts.length > 0 && userParts[0] === 'google';
    });
    return userExists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}

export async function checkIfFacebookUserExists(email) {
  try {
    const params = {
      UserPoolId: awsConfig.cognito.UserPoolId,
      Filter: `email="${email}"`,
    };
    const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
    if (data.Users.length === 0) {
      return true;
    }
    const userExists = data.Users.some((user) => {
      const userParts = user.Username.split('_');
      return userParts.length > 0 && userParts[0] === 'facebook';
    });
    return userExists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}

export async function checkIfUserLinkedToSocialProvider(attribute, value) {
  try {
    let filter;
    switch (attribute) {
      case 'email':
        filter = `email="${value}"`;
        break;
      case 'phone_number':
        filter = `phone_number="${value}"`;
        break;
      default:
        throw new Error('Invalid attribute');
    }
    const params = {
      UserPoolId: awsConfig.cognito.UserPoolId,
      Filter: filter,
    };
    const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
    return data.Users.some((user) => {
      const userParts = user.Username.split('_');
      return userParts.length > 0 && (userParts[0] === 'google' || userParts[0] === 'facebook');
    });
  } catch (error) {
    console.error('Error checking if user is linked to social provider:', error);
    return false;
  }
}

export async function exchangeCodeForToken(code) {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: awsConfig.cognito.ClientId,
      code: code,
      redirect_uri: awsConfig.redirect.Login,
    });

    const tokenResponse = await axios.post(`https://${awsConfig.cognito.Domain}/oauth2/token`, data, {
      headers: headers,
    });

    localStorage.setItem('access_token', tokenResponse.data.access_token);
    localStorage.setItem('id_token', tokenResponse.data.id_token);
    localStorage.setItem('refresh_token', tokenResponse.data.refresh_token);
    localStorage.setItem('accessToken', tokenResponse.data.access_token);
    localStorage.setItem('idToken', tokenResponse.data.id_token);
    localStorage.setItem('refreshToken', tokenResponse.data.refresh_token);
    return tokenResponse.data.access_token;
  } catch (error) {
    console.log('Error exchanging code for token:', error.response.data);
  }
}

export const exchangeTokenForUser = async (access_token) => {
  try {
    const userAttributesResponse = await axios.get(`https://${awsConfig.cognito.Domain}/oauth2/userInfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return userAttributesResponse;
  } catch (error) {
    console.log('Error exchanging token for user:', error);
  }
};

export async function checkIfUserExistsGetEmailPassword(attribute, value) {
  const params = {
    UserPoolId: awsConfig.cognito.UserPoolId,
    Filter: `${attribute} = "${value}"`,
  };

  const users = await cognitoIdentityServiceProvider.listUsers(params).promise();

  if (users.Users.length > 0) {
    const username = users.Users[0].Username;

    const forgotPasswordParams = {
      ClientId: awsConfig.cognito.ClientId, // Your app client id here
      Username: username,
    };
    console.log(forgotPasswordParams, 'FPP');

    try {
      await cognitoIdentityServiceProvider.forgotPassword(forgotPasswordParams).promise();
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }

    return true;
  }

  return false;
}

export async function getUserDetailsByEmail(email) {
  try {
    const params = {
      UserPoolId: awsConfig.cognito.UserPoolId,
      Filter: `email="${email}"`,
    };
    const users = await cognitoIdentityServiceProvider.listUsers(params).promise();
    console.log(users, 'USERS');
    const userAttributes = users.Users[0].Attributes;
    return userAttributes;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}
