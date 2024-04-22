import api from '../api';

export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: 'auth/authenticate',
        method: 'POST',
        body: credentials,
      }),
    }),
    changePassword: build.mutation({
      query: (credentials) => ({
        url: 'auth/change-password',
        method: 'POST',
        body: credentials,
      }),
    }),
    userLogout: build.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useUserLogoutMutation,
} = loginApi;

export const { endpoints } = loginApi;
