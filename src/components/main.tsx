import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Routes from './routes';
import { IPreloadedState } from '../types';

interface MainProps {
  store: Store<IPreloadedState>;
  history: History;
}

const Main: React.FC<MainProps> = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
);

export default Main;
