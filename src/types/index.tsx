import { ICompanyWorthState }    from './companyWorth';
import { ILocalizationState }    from './localization';
import { IMarketPriceState }     from './marketPrices';
import { IUserState }            from './user';
import { IFactory }              from './factory';
import { IHeadquarterState }     from './headquarter';
import { ISpecialBuildingState } from './specialBuildings';
import { IMineState }            from './mines';
import { IWarehouseState }       from './warehouses';

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
  localization: ILocalizationState;
}






