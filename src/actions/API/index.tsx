enum UserActions {
  isAPIUser          = 'USER_USES_API',
  setAPIKey          = 'SET_API_KEY',
  changeUserSettings = 'CHANGE_USER_SETTINGS',
  changePlayerInfo   = 'CHANGE_PLAYER_INFO',
}

interface IIsAPIUserAction {
  type: UserActions.isAPIUser,
  value: boolean;
}

interface IChangeUserAPIKeyAction {
  type: UserActions.setAPIKey;
  key: string;
}

interface IChangeUserSettings {
  type: UserActions.changeUserSettings;
  settingName: string;
  value: boolean | string;
}

interface IChangePlayerInfo {
  type: UserActions.changePlayerInfo;
  key: string;
  value: number | string;
}

type UserActionType = IChangeUserAPIKeyAction | IIsAPIUserAction | IChangeUserSettings | IChangePlayerInfo;

const isAPIUser = (value: boolean): IIsAPIUserAction => ({ type: UserActions.isAPIUser, value, });

const setAPIKey = (key: string): IChangeUserAPIKeyAction => ({ type: UserActions.setAPIKey, key, });

const changeUserSettings = (settingName: string, value: boolean | string): IChangeUserSettings => ({ type: UserActions.changeUserSettings, settingName, value, });

const changePlayerInfo = (key: string, value: number | string): IChangePlayerInfo => ({ type: UserActions.changePlayerInfo, key, value, });
export {
  UserActions,
  IIsAPIUserAction,
  IChangeUserAPIKeyAction,
  UserActionType,
  isAPIUser,
  setAPIKey,
  changeUserSettings,
  changePlayerInfo
};
