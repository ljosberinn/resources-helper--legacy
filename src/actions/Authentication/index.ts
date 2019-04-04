import { action } from 'typesafe-actions';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';
import { IUserState } from '../../types/user';
import { ISpecialBuildingState } from '../../types/specialBuildings';
import { IMarketPriceState } from '../../types/marketPrices';

export enum AuthenticationActions {
  LOGIN = '@@authentication/LOGIN',
  LOGOUT = '@@authentication/LOGOUT',
  REGISTER = '@@authentication/REGISTER',
}

export interface LoginResponse {
  factories: IFactory[];
  mines: IMineState;
  user: IUserState;
  specialBuildings: ISpecialBuildingState;
  marketPrices: IMarketPriceState;
}

export const login = (response: LoginResponse) => action(AuthenticationActions.LOGIN, response);
export const logout = () => action(AuthenticationActions.LOGOUT);
