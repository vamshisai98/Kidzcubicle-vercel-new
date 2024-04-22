import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '../common/utils/Constants';
import { clearToken } from '../store/clearTokenAction';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/`,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    // Works as interceptor
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(clearToken());
  }
  return result;
};

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [],
  endpoints: () => ({}),
});

export default api;
