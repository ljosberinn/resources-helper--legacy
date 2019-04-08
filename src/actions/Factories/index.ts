import { FactoryIDs } from './../../types/factory';
import { action } from 'typesafe-actions';
import { IFactory, IFactoryProductionRequirements } from '../../types/factory';

export enum FactoryActions {
  SET_LEVEL = '@@factories/SET_FACTORY_LEVEL',
  SET_FACTORIES = '@@factories/SET_FACTORIES',
  TOGGLE_DETAILS = '@@factories/TOGGLE_DETAILS',
  ADJUST_PRODUCTION_REQUIREMENTS_TO_LEVEL = '@@factories/ADJUST_REQUIREMENTS_TO_LEVEL',
}

export const setLevel = (level: number, factoryID: FactoryIDs) =>
  action(FactoryActions.SET_LEVEL, { level, factoryID });

export const setFactories = (factories: IFactory[]) => action(FactoryActions.SET_FACTORIES, factories);

export const toggleFactoryDetailsVisibility = (factoryID: FactoryIDs) =>
  action(FactoryActions.TOGGLE_DETAILS, { factoryID });

export const adjustProductionRequirementsToLevel = (
  factoryID: FactoryIDs,
  newRequirements: IFactoryProductionRequirements[],
) => action(FactoryActions.ADJUST_PRODUCTION_REQUIREMENTS_TO_LEVEL, { factoryID, newRequirements });
