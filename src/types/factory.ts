export interface IFactory {
  id: number;
  level: number;
  scaling: number;
  dependantFactories: number[];
  productionDependencies: IFactoryDependency[];
  hasDetailsVisible: boolean;
}

export interface IFactories {
  [key: string]: IFactory;
}

export interface FactoryProps {
  data: IFactory;
}

export interface IFactoryDependency {
  id: number;
  amount: number;
}
