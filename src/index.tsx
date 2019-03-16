import * as React               from 'react';
import * as ReactDOM            from 'react-dom';
import Main                     from './main';
import { createBrowserHistory } from 'history';
import { store }                from './Store';

const history = createBrowserHistory();

ReactDOM.render(<Main store={store} history={history}/>,
  document.getElementById('root') as HTMLElement
);
