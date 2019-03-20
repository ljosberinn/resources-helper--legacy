interface ISpecialBuildingState {
  id: number;
  level: number;
  dependencies: ISpecialBuildingDependency[];
}

interface ISpecialBuildingDependency {
  id: number;
  amount: number;
}

export { ISpecialBuildingState, ISpecialBuildingDependency };
