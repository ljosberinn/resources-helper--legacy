import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DEV_SETTINGS } from './developmentSettings';
import {
  companyWorth,
  factories,
  headquarter,
  marketPrices,
  mines,
  specialBuildings,
  user,
  version,
  warehouses,
} from './reducers';
import { IPreloadedState } from './types';

const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user,
    factories,
    headquarter,
    mines,
    specialBuildings,
    warehouses,
    companyWorth,
    marketPrices,
    version,
  });

const getLocalStorageVersion = () => 'rhelper' + DEV_SETTINGS.version.split('.').join('');

const persistedStoreConfig = {
  key: getLocalStorageVersion(),
  storage: storage,
  blacklist: ['router'],
};

export const configureStore = (history: History, preloadedState: IPreloadedState) => {
  const composeEnhancers = composeWithDevTools({});

  const reducer = rootReducer(history);
  const persistedReducer = persistReducer(persistedStoreConfig, reducer);

  const middlewares = [routerMiddleware(history)];
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(persistedReducer, preloadedState, composeEnhancers(...enhancers));
  const persistor = persistStore(store);

  return { store, persistor };
};
