import { action } from 'typesafe-actions';

export enum AuthenticationActions {
  LOGIN = '@@authentication/LOGIN',
  LOGOUT = '@@authentication/LOGOUT',
  REGISTER = '@@authentication/REGISTER',
}

export interface LoginResponse {
  apiKey: string;
  mail: string;
  pageRegistration: number;
  playerIndexUID: number;
  playerLevel: number;
  points: number;
  rank: number;
  registered: number;
  remainingAPICredits: number;
}

export const login = (response: LoginResponse) => action(AuthenticationActions.LOGIN, response);
export const logout = () => action(AuthenticationActions.LOGOUT);
