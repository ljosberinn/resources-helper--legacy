import { AuthenticationActions } from './../actions/Authentication/index';
import { Reducer } from 'redux';
import { FactoryActions } from '../actions/Factories';
import { preloadedState } from '../constants';
import { ICompanyWorthState } from '../types/companyWorth';
import { IHeadquarterState } from '../types/headquarter';
import { IMarketPriceState } from '../types/marketPrices';
import { IMineState } from '../types/mines';
import { ISpecialBuildingState } from '../types/specialBuildings';
import { IUserState } from '../types/user';
import { IWarehouseState } from '../types/warehouses';
import { IFactories } from './../types/factory';

export const factories: Reducer<IFactories> = (state = preloadedState.factories, action) => {
  switch (action.type) {
    case FactoryActions.TOGGLE_DETAILS:
      return {
        ...state,
        [action.payload.factoryID]: {
          ...state[action.payload.factoryID],
          hasDetailsVisible: !state[action.payload.factoryID].hasDetailsVisible,
        },
      };
    case FactoryActions.SET_LEVEL:
      return {
        ...state,
        [action.payload.factoryID]: {
          ...state[action.payload.factoryID],
          level: action.payload.level,
        },
      };
    case FactoryActions.SET_FACTORIES:
      return action.payload;
  }

  return state;
};

export const user: Reducer<IUserState> = (state = preloadedState.user, action) => {
  switch (action.type) {
    case AuthenticationActions.LOGIN:
      const keyLength = action.payload.apiKey.length;
      const isAPIUser = keyLength > 0 ? keyLength === 45 : false;

      return {
        ...state,
        isAPIUser,
        isAuthenticated: true,
        API: {
          ...state.API,
          key: action.payload.apiKey,
        },
        playerInfo: {
          ...state.playerInfo,
          level: action.payload.playerLevel,
          rank: action.payload.rank,
          registered: action.payload.registered,
        },
      };
    case AuthenticationActions.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
  }

  return state;
};

export const specialBuildings: Reducer<ISpecialBuildingState[]> = (state = preloadedState.specialBuildings, action) =>
  state;
export const headquarter: Reducer<IHeadquarterState> = (state = preloadedState.headquarter, action) => state;
export const mines: Reducer<IMineState[]> = (state = preloadedState.mines, action) => state;
export const marketPrices: Reducer<IMarketPriceState[]> = (state = preloadedState.marketPrices, action) => state;
export const warehouses: Reducer<IWarehouseState[]> = (state = preloadedState.warehouses, action) => state;
export const companyWorth: Reducer<ICompanyWorthState> = (state = preloadedState.companyWorth, action) => state;
export const version: Reducer<string> = (state = preloadedState.version) => state;
