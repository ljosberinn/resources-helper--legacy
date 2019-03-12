import * as React                  from 'react';
import * as ReactDOM               from 'react-dom';
//import registerServiceWorker from './registerServiceWorker';
import { Provider }                from 'react-redux';
import { Route, Switch }           from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { store }                   from './Store';
import API                         from './components/API';
import Factories                   from './components/Factories/Factories';

const Home = () => <h2>Home</h2>;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/api" component={API}/>
        <Route path="/settings"/>
        <Route path="/mines"/>
        <Route path="/factories" component={Factories}/>
        <Route path="/gd"/>
        <Route path="/flow"/>
        <Route path="/wh"/>
        <Route path="/buildings"/>
        <Route path="/recycling"/>
        <Route path="/units"/>
        <Route path="/tu"/>
        <Route path="/hq"/>
        <Route path="/missions"/>
        <Route path="/trade"/>
        <Route path="/attack"/>
        <Route path="/defense"/>
        <Route path="/maps"/>
        <Route path="/prices"/>
        <Route path="/quality"/>
        <Route path="/leaderboard"/>
        <Route path="/changelog"/>
        <Route path="/discord"/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);


//registerServiceWorker();
