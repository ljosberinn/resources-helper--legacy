import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../index';
import { IPreloadedState } from '../types';
import { Footer } from './Footer';
import { Header } from './Header';
import { Routes } from './Routes';

interface RHelperProps {
  store: Store<IPreloadedState>;
  history: History;
}

export const RHelper = ({ store, history }: RHelperProps) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Header />
        <Routes />
        <Footer />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);
