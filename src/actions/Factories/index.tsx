import { IFactoryLocalization } from '../../components/Factories/interfaces';
import { IFactory } from '../../types/factory';
import { action } from 'typesafe-actions';

enum FactoryActions {
  SET_LEVEL = '@@factories/SET_FACTORY_LEVEL',
  SET_FACTORIES = '@@factories/SET_FACTORIES',
  SET_LOCALIZATION = '@@factories/SET_LOCALIZATION',
}

const setLevel = (level: number, factoryID: number) => action(FactoryActions.SET_LEVEL, { level, factoryID });
const setFactories = (factories: IFactory[]) => action(FactoryActions.SET_FACTORIES, factories);
const setLocalization = (type: string, localization: IFactoryLocalization) =>
  action(FactoryActions.SET_LOCALIZATION, { localization, type });

export { FactoryActions, setLevel, setFactories, setLocalization };
