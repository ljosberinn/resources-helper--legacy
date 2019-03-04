export enum UserActions {
  isAPIUser = "USER_USES_API",
  setAPIKey = "SET_API_KEY"
}

export interface IChangeUserUsesAPIAction {
  type: UserActions.isAPIUser,
  value: boolean;
}

export interface IChangeUserAPIKeyAction {
  type: UserActions.setAPIKey;
  APIKey: string;
}

export type UserActionType = IChangeUserAPIKeyAction | IChangeUserUsesAPIAction;

export function changeUserUsesAPI(value: boolean): IChangeUserUsesAPIAction {
  return {
    type: UserActions.isAPIUser,
    value
  };
}

export function setAPIKey(APIKey: string): IChangeUserAPIKeyAction {
  return {
    type: UserActions.setAPIKey,
    APIKey
  };
}


