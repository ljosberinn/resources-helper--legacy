import { applyMiddleware, combineReducers, createStore, Store }                                                                 from 'redux';
import { DEV_SETTINGS }                                                                                                         from './developmentSettings';
import { companyWorth, factories, headquarter, localization, marketPrices, mines, specialBuildings, user, version, warehouses } from './reducers';
import { connectRouter, routerMiddleware }                                                                                      from 'connected-react-router';
import { History }                                                                                                              from 'history';
import { composeWithDevTools }                                                                                                  from 'redux-devtools-extension';
import { IPreloadedState }                                                                                                      from './types';
import createBrowserHistory                                                                                                     from 'history/createBrowserHistory';
import { preloadedState }                                                                                                       from './constants';

const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  user,
  factories,
  headquarter,
  mines,
  specialBuildings,
  warehouses,
  companyWorth,
  marketPrices,
  localization,
  version
});

const getLocalStorageVersion = () => 'rhelper' + DEV_SETTINGS.version.split('.').join('');

const saveState = () => {
  const { router, ...currentStore } = store.getState();

  localStorage.setItem(getLocalStorageVersion(), JSON.stringify(currentStore));
};

const loadState = (state: IPreloadedState) => {
  const previousState = localStorage.getItem(getLocalStorageVersion());

  if (previousState !== null) {
    return JSON.parse(previousState) as IPreloadedState;
  }

  return state;
};

const configureStore = (history: History, preloadedState: IPreloadedState): Store => {

  const composeEnhancers = composeWithDevTools({});

  return createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history)))
  );
};

const store = configureStore(createBrowserHistory(), loadState(preloadedState));

export {
  store,
  saveState
};
