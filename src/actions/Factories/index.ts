import { action } from 'typesafe-actions';
import { IFactories, IFactoryRequirements } from '../../types/factory';

export enum FactoryActions {
  SET_LEVEL = '@@factories/SET_FACTORY_LEVEL',
  SET_FACTORIES = '@@factories/SET_FACTORIES',
  TOGGLE_DETAILS = '@@factories/TOGGLE_DETAILS',
  ADJUST_REQUIREMENTS_TO_LEVEL = '@@factories/ADJUST_REQUIREMENTS_TO_LEVEL',
}

export const setLevel = (level: number, factoryID: number) => action(FactoryActions.SET_LEVEL, { level, factoryID });
export const setFactories = (factories: IFactories) => action(FactoryActions.SET_FACTORIES, factories);
export const toggleFactoryDetailsVisibility = (factoryID: number) =>
  action(FactoryActions.TOGGLE_DETAILS, { factoryID });
export const adjustRequirementsToLevel = (factoryID: number, newRequirements: IFactoryRequirements[]) =>
  action(FactoryActions.ADJUST_REQUIREMENTS_TO_LEVEL, { factoryID, newRequirements });
