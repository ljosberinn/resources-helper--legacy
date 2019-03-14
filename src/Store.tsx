import { applyMiddleware, combineReducers, createStore, Store }                            from 'redux';
import { companyWorth, factories, headquarter, mines, specialBuildings, user, warehouses } from './reducers';
import { connectRouter, routerMiddleware }                                                 from 'connected-react-router';
import { History }                                                                         from 'history';
import { composeWithDevTools }                                                             from 'redux-devtools-extension';
import { IPreloadedState }                                                                 from './types';
import createBrowserHistory                                                                from 'history/createBrowserHistory';
import { preloadedState }                                                                  from './constants';

const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  user,
  factories,
  headquarter,
  mines,
  specialBuildings,
  warehouses,
  companyWorth
});

const configureStore = (history: History, preloadedState: IPreloadedState): Store => {

  const composeEnhancers = composeWithDevTools({});

  return createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history)))
  );
};

export const store = configureStore(createBrowserHistory(), preloadedState);
