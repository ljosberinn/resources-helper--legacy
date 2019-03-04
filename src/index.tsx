import * as React from "react";
import * as ReactDOM from "react-dom";
//import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux";
//import { configureStore } from "./Store";
import { Route, Switch } from "react-router";
import APIKeyInput from "./components/APIKeyInput";
import { BrowserRouter as Router } from "react-router-dom";
import "./blueprint.css";
import { store } from "./Store";

const Home = () => <h2>Home</h2>;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/api" component={APIKeyInput}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root") as HTMLElement
);


//registerServiceWorker();
