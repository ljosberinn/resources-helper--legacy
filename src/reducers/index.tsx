import { UserActionType, UserActions } from "../actions";
import { IPreloadedState } from "../types";

export const preloadedState: IPreloadedState = {
  user: {
    isAPIUser: true,
    APIKey: "bb4d6e66508b4dd58b61ff118acbffe958cba26f85be3",
    settings: {
      remembersAPIKey: false
    },
    playerInfo: {
      userName: "",
      level: 0,
      rank: 0,
      registered: 0
    },
    meta: {
      lastAPICall: 0
    }
  },
  factories: [],
  mines: [],
  specialBuildings: [],
  headquarter: []
};

export function user(state = preloadedState, action: UserActionType) {
  switch (action.type) {
    case UserActions.setAPIKey:
      return {
        ...state,
        APIKey: action.APIKey
      };
    case UserActions.isAPIUser:
      return {
        ...state,
        isAPIUser: action.value
      };
  }

  return {
    isAPIUser: false,
    APIKey: "",
    settings: {
      remembersAPIKey: false
    },
    playerInfo: {
      userName: "",
      level: 0,
      rank: 0,
      registered: 0
    },
    meta: {
      lastAPICall: 0
    }
  };
}

export function factories(state = preloadedState) {
  return [];
}

export function headquarter(state = preloadedState) {
  return [];
}

export function mines(state = preloadedState) {
  return [];
}

export function specialBuildings(state = preloadedState) {
  return [];
}
