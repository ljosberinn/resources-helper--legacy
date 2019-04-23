/*import * as Sentry from '@sentry/browser';*/
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { RHelper } from './components/RHelper';
import { preloadedState } from './constants';
import { configureStore } from './Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Loading } from './components/Shared/Loading';
import { ConnectedRouter } from 'connected-react-router';
import 'rbx/index.css';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

/*Sentry.init({
  dsn: 'https://7b1b186565cf49e282d282f55c8e615c@sentry.io/1422548',
});*/

const history = createBrowserHistory();

export const { store, persistor } = configureStore(history, preloadedState);

render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ConnectedRouter history={history}>
        <RHelper store={store} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
