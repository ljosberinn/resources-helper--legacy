import { FactoryIDs, ProductIDs } from './../../types/factory';
import { action } from 'typesafe-actions';
import { IFactory, IFactoryProductionRequirements } from '../../types/factory';
import { ResourceIDs } from '../../types/mines';

export enum FactoryActions {
  SET_LEVEL = '@@factories/SET_FACTORY_LEVEL',
  SET_FACTORIES = '@@factories/SET_FACTORIES',
  TOGGLE_DETAILS = '@@factories/TOGGLE_DETAILS',
  ADJUST_PRODUCTION_REQUIREMENTS_TO_LEVEL = '@@factories/ADJUST_REQUIREMENTS_TO_LEVEL',
  SET_WORKLOAD = '@@factories/SET_WORKLOAD',
  ADJUST_PRODUCTION_REQUIREMENTS_TO_GIVEN_AMOUNT = '@@factories/ADJUST_PRODUCTION_REQUIREMENTS_TO_GIVEN_AMOUNT',
}

export const setLevel = (level: number, factoryID: FactoryIDs) => action(FactoryActions.SET_LEVEL, { level, factoryID });

export const setFactories = (factories: IFactory[]) => action(FactoryActions.SET_FACTORIES, factories);

export const toggleFactoryDetailsVisibility = (factoryID: FactoryIDs) => action(FactoryActions.TOGGLE_DETAILS, { factoryID });

export const adjustProductionRequirementsToLevel = (factoryID: FactoryIDs, newRequirements: IFactoryProductionRequirements[]) =>
  action(FactoryActions.ADJUST_PRODUCTION_REQUIREMENTS_TO_LEVEL, { factoryID, newRequirements });

export const setWorkload = (factoryID: FactoryIDs, workload: number) => action(FactoryActions.SET_WORKLOAD, { factoryID, workload });

export const adjustProductionRequirementsToGivenAmount = (factoryID: FactoryIDs, requirementID: ResourceIDs | ProductIDs, amount: number) =>
  action(FactoryActions.ADJUST_PRODUCTION_REQUIREMENTS_TO_GIVEN_AMOUNT, { factoryID, requirementID, amount });
