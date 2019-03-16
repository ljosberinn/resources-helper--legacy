interface IFactory {
  id: number;
  level: number;
  scaling: number;
  dependantFactories: number[];
  dependencies: IFactoryDependency[];
}

interface IFactoryDependency {
  id: number;
  amount: number;
}

export {
  IFactory,
  IFactoryDependency
};
