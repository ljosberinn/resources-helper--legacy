import { specialBuildings } from './../reducers/index';
export interface IUserState {
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
  isAPIUser: boolean;
  key: string;
  lastUpdates: IUserAPIUpdateHistory;
}

export interface IUserAPIUpdateHistory {
  factories: number;
  specialBuildings: number;
  mines: number;
  warehouses: number;
  tradeLog: number;
  combatLog: number;
  headquarter: number;
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
