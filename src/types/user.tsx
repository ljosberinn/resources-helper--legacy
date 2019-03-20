interface IUserState {
  isAPIUser: boolean;
  isAuthenticated: boolean;
  settings: IUserSettings;
  playerInfo: IUserPlayerInfo;
  API: IUserAPIState;
}

interface IUserSettings {
  remembersAPIKey: boolean;
  locale: string;
}

interface IUserPlayerInfo {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}

interface IUserAPIState {
  key: string;
  lastAPICall: number;
  userAPIStatistics: IUserAPIStatistic[];
}

interface IUserAPIStatistic {
  id: number;
  lastCall: number;
  amount: number;
}

interface IUserPlayerInfoState {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}

interface IUserSettingState {
  remembersAPIKey: boolean;
  locale: string;
}

export { IUserPlayerInfoState, IUserSettingState, IUserAPIState, IUserPlayerInfo, IUserState };
