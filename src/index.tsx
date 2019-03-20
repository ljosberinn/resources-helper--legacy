import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './components/main';
import { preloadedState } from './constants';
import { configureStore } from './Store';

const history = createBrowserHistory();

const { store, persistor } = configureStore(history, preloadedState);

ReactDOM.render(<Main store={store} history={history} />, document.getElementById('root') as HTMLElement);

export { store, persistor };
