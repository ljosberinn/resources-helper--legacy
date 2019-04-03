import { ICompanyWorthState } from './companyWorth';
import { IFactory } from './factory';
import { IHeadquarterState } from './headquarter';
import { IMarketPriceState } from './marketPrices';
import { IMineState } from './mines';
import { ISpecialBuildingState } from './specialBuildings';
import { IUserState } from './user';
import { IWarehouseState } from './warehouses';

export interface IPreloadedState {
  version: string;
  user: IUserState;
  factories: IFactory[];
  headquarter: IHeadquarterState;
  specialBuildings: ISpecialBuildingState[];
  mines: IMineState[];
  companyWorth: ICompanyWorthState;
  warehouses: IWarehouseState[];
  marketPrices: IMarketPriceState[];
}
