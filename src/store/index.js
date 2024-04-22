import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from 'redux';

import api from '../services/api';
import AuthSlice from './slices/AuthSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: AuthSlice,
});

const rootReducer = (state, action) => {
  let updatedState = { ...state };
  if (action.type === 'auth/logout' || action.type === 'auth/clearToken') {
    // this applies to all keys defined in persistConfig(s)
    storage.removeItem('persist:root');
    updatedState = {};
  }
  return appReducer(updatedState, action);
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
