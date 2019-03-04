export interface IUser {
  isAPIUser: boolean;
  APIKey: string;
  settings: IUserSettings;
  playerInfo: IUserPlayerInfo;
  meta: IUserMeta;
}

interface IUserSettings {
  remembersAPIKey: boolean;
}

export interface IUserPlayerInfo {
  userName: string;
  level: number;
  rank: number;
  registered: number;
}

interface IUserMeta {
  lastAPICall: number;
}
