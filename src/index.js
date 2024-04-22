import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import awsConfig from './aws/aws-config';
import { FacebookProvider } from 'react-facebook';

const root = ReactDOM.createRoot(document.getElementById('root'));
const googleClientId = awsConfig.social.Google.ClientId;
const facebookClientId = awsConfig.social.Facebook.ClientId;

root.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <BrowserRouter>
        <GoogleOAuthProvider clientId={googleClientId}>
          <FacebookProvider appId={facebookClientId}>
            <App />
          </FacebookProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
