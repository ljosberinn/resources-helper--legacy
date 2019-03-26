export interface IUserState {
  isAPIUser: boolean;
  isAuthenticated: boolean;
  settings: IUserSettings;
  playerInfo: IUserPlayerInfo;
  API: IUserAPIState;
}

export interface IUserSettings {
  remembersAPIKey: boolean;
  locale: string;
}

export interface IUserPlayerInfo {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}

export interface IUserAPIState {
  key: string;
  history: IUserAPIHistory;
}

export interface IUserAPIHistory {
  lastCall: number;
  lastQuery: number;
}

export interface IUserPlayerInfoState {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}

export interface IUserSettingState {
  remembersAPIKey: boolean;
  locale: string;
}
