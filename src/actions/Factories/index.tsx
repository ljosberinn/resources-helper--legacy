import { IFactory } from '../../types/factory';

enum FactoryActions {
  setFactoryLevel = 'SET_FACTORY_LEVEL',
  setFactories    = 'SET_FACTORIES',
}

interface ISetFactoryLevelAction {
  type: FactoryActions.setFactoryLevel,
  level: number;
  factoryID: number;
}

interface ISetFactories {
  type: FactoryActions.setFactories;
  factories: IFactory[];
}

type FactoryActionType = ISetFactoryLevelAction | ISetFactories;

const setFactoryLevel = (level: number, factoryID: number): ISetFactoryLevelAction => ({ type: FactoryActions.setFactoryLevel, level, factoryID, });
const setFactories = (factories: IFactory[]) => ({ type: FactoryActions.setFactories, factories: [...factories] });

export {
  FactoryActions,
  FactoryActionType,
  setFactoryLevel,
  setFactories
};
