import { UserActions, UserActionType }                                         from '../actions/API';
import { preloadedState, UserAPIState, UserPlayerInfoState, UserSettingState } from '../constants';
import { FactoryActions, FactoryActionType }                                   from '../actions/Factories';

const API = (state = UserAPIState, action: UserActionType) => {
  switch (action.type) {
    case UserActions.setAPIKey:
      return {
        ...state,
        key: action.key
      };
  }

  return state;
};

const Settings = (state = UserSettingState, action: UserActionType) => {
  switch (action.type) {
    case UserActions.changeUserSettings:
      const newSettings = {
        ...state
      };

      newSettings[action.settingName] = action.value;
      return newSettings;
  }

  return state;
};

const PlayerInfo = (state = UserPlayerInfoState, action: UserActionType) => {
  switch (action.type) {
    case UserActions.changePlayerInfo:
      const newPlayerInfo = {
        ...state
      };

      newPlayerInfo[action.key] = action.value;
      return newPlayerInfo;
  }

  return state;
};

const user = (state = preloadedState.user, action: UserActionType) => {
  switch (action.type) {
    case UserActions.setAPIKey:
      return {
        ...state,
        API: API(state.API, action)
      };
    case UserActions.isAPIUser:
      return {
        ...state,
        isAPIUser: action.value
      };
    case UserActions.changeUserSettings:
      return {
        ...state,
        settings: Settings(state.settings, action)
      };
    case UserActions.changePlayerInfo: {
      return {
        ...state,
        playerInfo: PlayerInfo(state.playerInfo, action)
      };
    }
  }

  return state;
};

const factories = (state = preloadedState.factories, action: FactoryActionType) => {
  switch (action.type) {
    case FactoryActions.setFactoryLevel:
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

const specialBuildings = (state = preloadedState.specialBuildings) => {
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
  companyWorth
};
