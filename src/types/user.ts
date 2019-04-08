export interface IUserState {
  isAuthenticated: boolean;
  settings: IUserSettings;
  playerInfo: IUserPlayerInfo;
  API: IUserAPIState;
}

export interface IUserSettings {
  prices: IUserPriceSettings;
  remembersAPIKey: boolean;
  locale: UserSettingLocales;
}

export type UserSettingLocales = 'en' | 'de' | 'fr' | 'jp' | 'cz' | 'es' | 'ru' | 'cn';

export interface IUserPriceSettings {
  range: UserPriceSettingRange;
  type: UserPriceSettingType;
}

export type UserPriceSettingRange = 1 | 24 | 48 | 72 | 96 | 120 | 144 | 168;
export type UserPriceSettingType = 'xml' | 'json' | 'csv';

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
  marketPrices: number;
}

export interface IUserPlayerInfoState {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}
