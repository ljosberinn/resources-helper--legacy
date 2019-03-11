export interface ISpecialBuildingState {
  id: number;
  dependencies: ISpecialBuildingDependency[];
}

interface ISpecialBuildingDependency {
  id: number;
  amount: number;
}
