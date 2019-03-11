import { IUserState }            from './user';
import { IFactory }              from './factory';
import { IHeadquarterState }     from './headquarter';
import { ISpecialBuildingState } from './specialBuildings';
import { IMineState }            from './mines';

interface ICompanyWorthState {
  headquarter: number;
  factories: number;
  mines: number;
  specialBuildings: number;
}

export interface IPreloadedState {
  user: IUserState;
  factories: IFactory[];
  headquarter: IHeadquarterState;
  specialBuildings: ISpecialBuildingState[];
  mines: IMineState[];
  companyWorth: ICompanyWorthState;
}






