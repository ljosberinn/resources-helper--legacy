import { setLevel, toggleFactoryDetailsVisibility } from '../actions/Factories';

export interface IFactory {
  id: number;
  level: number;
  scaling: number;
  dependantFactories: readonly number[];
  productionDependencies:  IFactoryDependency[];
  hasDetailsVisible: boolean;
}

export interface IFactories {
  [key: string]: IFactory;
}

export interface FactoryProps {
  data: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

export interface IFactoryDependency {
  id: number;
  amount: number;
}
