export interface IUserState {
  isAPIUser: boolean;
  settings: IUserSettings;
  playerInfo: IUserPlayerInfo;
  API: IUserAPIState;
}

interface IUserSettings {
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
  lastAPICall: number;
  userAPIStatistics: IUserAPIStatistic[];
}

interface IUserAPIStatistic {
  id: number;
  lastCall: number;
  amount: number;
}
