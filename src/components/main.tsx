import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Routes from './routes';
import { IPreloadedState } from '../types';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../index';

interface MainProps {
  store: Store<IPreloadedState>;
  history: History;
}

const Main: React.FC<MainProps> = ({ store, history }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

export default Main;
