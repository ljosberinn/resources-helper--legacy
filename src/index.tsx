import * as Sentry from '@sentry/browser';
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { RHelper } from './components/RHelper';
import { preloadedState } from './constants';
import { configureStore } from './Store';

Sentry.init({
  dsn: 'https://7b1b186565cf49e282d282f55c8e615c@sentry.io/1422548',
});

const history = createBrowserHistory();

export const { store, persistor } = configureStore(history, preloadedState);

render(<RHelper store={store} history={history} />, document.getElementById('root') as HTMLElement);