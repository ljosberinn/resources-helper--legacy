export interface ISpecialBuildingState {
  id: number;
  level: number;
  dependencies: ISpecialBuildingDependency[];
}

export interface ISpecialBuildingDependency {
  id: number;
  amount: number;
}
