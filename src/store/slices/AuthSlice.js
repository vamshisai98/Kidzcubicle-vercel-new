import { createSlice } from '@reduxjs/toolkit';

import { endpoints } from '../../services/apis/AuthService';
import { CLEAR_TOKEN } from '../clearTokenAction';

const initialState = {
  currentStep: 0,
  token: null,
  cognitoUser: null,
  googleUser: null,
  facebookUser: null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {},
    setCurrentStep(state, action) {
      state.currentStep = action.payload.currentStep;
    },
    setCognitoUser(state, action) {
      state.cognitoUser = action.payload.cognitoUser;
    },
    setAccessToken(state, action) {
      state.token = action.payload.token;
    },
    setGoogleUserDetails(state, action) {
      state.googleUser = action.payload.googleUser;
    },
    setFacebookUserDetails(state, action) {
      state.facebookUser = action.payload.facebookUser;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CLEAR_TOKEN, (state) => {
      state.token = null;
    });
    builder.addMatcher(endpoints.login.matchFulfilled, (state, action) => {
      state.token = action?.payload?.access_token;
    });
    builder.addMatcher(endpoints.changePassword.matchFulfilled, (state, action) => {
      state.token = action?.payload?.access_token;
    });
  },
});
export const { logout, setCurrentStep, setCognitoUser, setAccessToken, setGoogleUserDetails, setFacebookUserDetails } =
  AuthSlice.actions;

export default AuthSlice.reducer;
