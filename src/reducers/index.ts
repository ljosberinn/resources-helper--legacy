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
    case FactoryActions.ADJUST_REQUIREMENTS_TO_LEVEL:
      return {
        ...state,
        [action.payload.factoryID]: {
          ...state[action.payload.factoryID],
          requirements: action.payload.newRequirements,
        },
      };
    case AuthenticationActions.LOGIN:
      return {
        ...action.payload.factories,
      };
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
      return {
        ...action.payload.user,
      };
    case AuthenticationActions.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
  }

  return state;
};

export const specialBuildings: Reducer<ISpecialBuildingState[]> = (state = preloadedState.specialBuildings, action) => {
  switch (action.type) {
    case AuthenticationActions.LOGIN:
      return {
        ...action.payload.specialBuildings,
      };
  }

  return state;
};

export const mines: Reducer<IMineState[]> = (state = preloadedState.mines, action) => {
  switch (action.type) {
    case AuthenticationActions.LOGIN:
      return {
        ...action.payload.mines,
      };
  }

  return state;
};

export const warehouses: Reducer<IWarehouseState[]> = (state = preloadedState.warehouses, action) => {
  switch (action.type) {
    case AuthenticationActions.LOGIN:
      return {
        ...action.payload.warehouses,
      };
  }

  return state;
};

export const headquarter: Reducer<IHeadquarterState> = (state = preloadedState.headquarter, action) => state;

export const marketPrices: Reducer<IMarketPriceState[]> = (state = preloadedState.marketPrices, action) => state;
export const companyWorth: Reducer<ICompanyWorthState> = (state = preloadedState.companyWorth, action) => state;
export const version: Reducer<string> = (state = preloadedState.version) => state;
