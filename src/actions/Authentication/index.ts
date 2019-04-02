import { action } from 'typesafe-actions';
import { IFactories } from '../../types/factory';
import { IMineState } from '../../types/mines';
import { IUserState } from '../../types/user';
import { ISpecialBuildingState } from '../../types/specialBuildings';

export enum AuthenticationActions {
  LOGIN = '@@authentication/LOGIN',
  LOGOUT = '@@authentication/LOGOUT',
  REGISTER = '@@authentication/REGISTER',
}

export interface LoginResponse {
  factories: IFactories;
  mines: IMineState;
  user: IUserState;
  specialBuildings: ISpecialBuildingState;
}

export const login = (response: LoginResponse) => action(AuthenticationActions.LOGIN, response);
export const logout = () => action(AuthenticationActions.LOGOUT);
