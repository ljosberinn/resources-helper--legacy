import { action } from 'typesafe-actions';
import { IFactories } from '../../types/factory';

export enum FactoryActions {
  SET_LEVEL = '@@factories/SET_FACTORY_LEVEL',
  SET_FACTORIES = '@@factories/SET_FACTORIES',
  TOGGLE_DETAILS = '@@factories/TOGGLE_DETAILS',
}

export const setLevel = (level: number, factoryID: number) => action(FactoryActions.SET_LEVEL, { level, factoryID });
export const setFactories = (factories: IFactories) => action(FactoryActions.SET_FACTORIES, factories);
export const toggleFactoryDetailsVisibility = (factoryID: number) => action(FactoryActions.TOGGLE_DETAILS, {factoryID});