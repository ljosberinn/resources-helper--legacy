import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { factories, headquarter, mines, preloadedState, specialBuildings, user } from "./reducers";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import { composeWithDevTools } from "redux-devtools-extension";
import { IPreloadedState } from "./types";
import createBrowserHistory from "history/createBrowserHistory";

const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  user,
  factories,
  headquarter,
  mines,
  specialBuildings
});

function configureStore(history: History, preloadedState: IPreloadedState): Store {

  const composeEnhancers = composeWithDevTools({});

  return createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history)))
  );
}

export const store = configureStore(createBrowserHistory(), preloadedState);
