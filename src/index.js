import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/Store';
import Spinner from './views/spinner/Spinner';
import './_mockApis';
import './utils/i18n';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

const storeAuth = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <AuthProvider store={storeAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  </Provider>,
);
