import { IFactoryLocalization } from 'src/components/Factories/interfaces';

interface ILocalizationState {
  factories: IFactoryLocalization;
  headquarter: ILocalization[];
  mines: ILocalization[];
  specialBuildings: ILocalization[];
  warehouses: ILocalization[];
}

interface ILocalization {}

export { ILocalizationState, ILocalization };
