import { createAction } from '@reduxjs/toolkit';

export const CLEAR_TOKEN = 'auth/clearToken';

export const clearToken = createAction(CLEAR_TOKEN);
