import { Reducer } from 'redux';
import { UserActions } from '../actions/API';
import { SpecialBuildingActions } from '../actions/Buildings';
import { FactoryActions } from '../actions/Factories';
import { preloadedState } from '../constants';
import { ICompanyWorthState } from '../types/companyWorth';
import { IFactory } from '../types/factory';
import { IHeadquarterState } from '../types/headquarter';
import { ILocalizationState } from '../types/localization';
import { IMarketPriceState } from '../types/marketPrices';
import { IMineState } from '../types/mines';
import { ISpecialBuildingState } from '../types/specialBuildings';
import { IUserState } from '../types/user';
import { IWarehouseState } from '../types/warehouses';

const user: Reducer<IUserState> = (state = preloadedState.user, action) => {
  switch (action.type) {
    case UserActions.SET_API_KEY:
      return {
        ...state,
        API: {
          ...state.API,
          key: action.payload,
        },
      };
  }

  return state;
};

const factories: Reducer<IFactory[]> = (state = preloadedState.factories, action) => {
  switch (action.type) {
    case FactoryActions.SET_LEVEL:
      return state.map(factory => {
        if (factory.id === action.payload.factoryID) {
          return {
            ...factory,
            level: action.payload.level,
          };
        }

        return factory;
      });
    case FactoryActions.SET_FACTORIES:
      return action.payload;
  }

  return state;
};

const specialBuildings: Reducer<ISpecialBuildingState[]> = (state = preloadedState.specialBuildings, action) => {
  switch (action.type) {
    case SpecialBuildingActions.SET_LEVEL:
      return state.map(specialBuilding => {
        if (specialBuilding.id === action.payload.buildingID) {
          return {
            ...specialBuilding,
            level: action.payload.level,
          };
        }

        return specialBuilding;
      });
    case SpecialBuildingActions.SET_BUILDINGS:
      return action.payload;
  }

  return state;
};

const headquarter: Reducer<IHeadquarterState> = (state = preloadedState.headquarter, action) => state;
const mines: Reducer<IMineState[]> = (state = preloadedState.mines, action) => state;
const marketPrices: Reducer<IMarketPriceState[]> = (state = preloadedState.marketPrices, action) => state;
const warehouses: Reducer<IWarehouseState[]> = (state = preloadedState.warehouses, action) => state;
const companyWorth: Reducer<ICompanyWorthState> = (state = preloadedState.companyWorth, action) => state;
const localization: Reducer<ILocalizationState> = (state = preloadedState.localization, action) => {
  switch (action.type) {
    case FactoryActions.SET_LOCALIZATION:
    case SpecialBuildingActions.SET_LOCALIZATION:
      return {
        ...state,
        [action.payload.type]: action.payload.localization,
      };
  }

  return state;
};
const version: Reducer<string> = (state = preloadedState.version) => state;

export {
  specialBuildings,
  headquarter,
  mines,
  factories,
  user,
  warehouses,
  companyWorth,
  marketPrices,
  localization,
  version,
};
