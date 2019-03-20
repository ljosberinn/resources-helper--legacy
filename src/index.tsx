import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './components/main';
import { store } from './Store';

const history = createBrowserHistory();

ReactDOM.render(<Main store={store} history={history} />, document.getElementById('root') as HTMLElement);
