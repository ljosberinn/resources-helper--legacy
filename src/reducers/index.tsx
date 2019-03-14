import { UserActions, UserActionType }                       from '../actions/API';
import { preloadedState }                                    from '../constants';
import { FactoryActions, FactoryActionType }                 from '../actions/Factories';
import { SpecialBuildingActions, SpecialBuildingActionType } from '../actions/Buildings';

const user = (state = preloadedState.user, action: UserActionType) => {
  switch (action.type) {
    case UserActions.setAPIKey:
      return {
        ...state,
        API: {
          ...state.API,
          key: action.key,
        }
      };
    case UserActions.isAPIUser:
      return {
        ...state,
        isAPIUser: action.value
      };
    case UserActions.changeUserSettings:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.settingName]: action.value
        }
      };
    case UserActions.changePlayerInfo: {
      return {
        ...state,
        playerInfo: {
          ...state.playerInfo,
          [action.key]: action.value,
        }
      };
    }
  }

  return state;
};

const factories = (state = preloadedState.factories, action: FactoryActionType) => {
  switch (action.type) {
    case FactoryActions.setLevel:
      return state.map(factory => {
        if (factory.id === action.factoryID) {

          return {
            ...factory,
            level: action.level
          };
        }

        return factory;
      });
    case FactoryActions.setFactories:
      return [...action.factories];
  }

  return state;
};

const headquarter = (state = preloadedState.headquarter) => {
  return state;
};

const mines = (state = preloadedState.mines) => {
  return state;
};

const specialBuildings = (state = preloadedState.specialBuildings, action: SpecialBuildingActionType) => {
  switch (action.type) {
    case SpecialBuildingActions.setLevel:
      return state.map(specialBuilding => {
        if (specialBuilding.id === action.buildingID) {

          return {
            ...specialBuilding,
            level: action.level
          };
        }

        return specialBuilding;
      });
    case SpecialBuildingActions.setBuildings:
      return [...action.buildings];
  }

  return state;
};

const warehouses = (state = preloadedState.warehouses) => {
  return state;
};

const companyWorth = (state = preloadedState.companyWorth) => {
  return state;
};

export {
  specialBuildings,
  headquarter,
  mines,
  factories,
  user,
  warehouses,
  companyWorth
};
