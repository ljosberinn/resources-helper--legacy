import { MarketPriceActions } from './../actions/MarketPrices/index';
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
import { IFactory } from './../types/factory';
import { MineActions } from '../actions/Mines';

export const factories: Reducer<IFactory[]> = (state = preloadedState.factories, action) => {
  switch (action.type) {
    case FactoryActions.ADJUST_REQUIREMENTS_TO_LEVEL:
      return state.map(factory => {
        if (factory.id !== action.payload.factoryID) {
          return factory;
        }

        return {
          ...factory,
          requirements: action.payload.newRequirements,
        };
      });
    case AuthenticationActions.LOGIN:
      return action.payload.factories;
    case FactoryActions.TOGGLE_DETAILS:
      return state.map(factory => {
        if (factory.id !== action.payload.factoryID) {
          return factory;
        }

        return {
          ...factory,
          hasDetailsVisible: !factory.hasDetailsVisible,
        };
      });
    case FactoryActions.SET_LEVEL:
      return state.map(factory => {
        if (factory.id !== action.payload.factoryID) {
          return factory;
        }

        return {
          ...factory,
          level: action.payload.level,
        };
      });
    case FactoryActions.SET_FACTORIES:
      return action.payload;
  }

  return state;
};

export const user: Reducer<IUserState> = (state = preloadedState.user, action) => {
  switch (action.type) {
    case MarketPriceActions.SET_LAST_UPDATE:
      return {
        ...state,
        settings: {
          ...state.settings,
          prices: {
            ...state.settings.prices,
            lastUpdate: action.payload,
          },
        },
      };
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
      return [...action.payload.mines];
    case MineActions.SET_MINES:
      return action.payload;

    case MineActions.SET_TECHED_MINING_RATE:
      return state.map(mine => {
        if (mine.resourceID !== action.payload.id) {
          return mine;
        }

        return {
          ...mine,
          sumTechRate: action.payload.techedRate,
        };
      });
    case MineActions.SET_AMOUNT:
      return state.map(mine => {
        if (mine.resourceID !== action.payload.id) {
          return mine;
        }

        return {
          ...mine,
          amount: action.payload.amount,
        };
      });
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

export const headquarter: Reducer<IHeadquarterState> = (state = preloadedState.headquarter) => state;

export const marketPrices: Reducer<IMarketPriceState> = (state = preloadedState.marketPrices, action) => {
  switch (action.type) {
    case AuthenticationActions.LOGIN:
      return action.payload.marketPrices;
    case MarketPriceActions.SET_PRICES:
      return action.payload;
  }

  return state;
};
export const companyWorth: Reducer<ICompanyWorthState> = (state = preloadedState.companyWorth) => state;
export const version: Reducer<string> = (state = preloadedState.version) => state;
