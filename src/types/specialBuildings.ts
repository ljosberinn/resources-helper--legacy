export interface ISpecialBuildingState {
  id: SpecialBuildingIDs;
  level: number;
  dependencies: ISpecialBuildingDependency[];
}

type SpecialBuildingIDs = 59 | 62 | 65 | 71 | 72 | 86 | 97 | 116 | 119 | 121 | 122 | 123 | 126 | 127;

export interface ISpecialBuildingDependency {
  readonly id: SpecialBuilingDependencyIDs;
  amount: number;
}

type SpecialBuilingDependencyIDs =
  | 1
  | 57
  | 115
  | 77
  | 7
  | 40
  | 55
  | 41
  | 24
  | 75
  | 35
  | 60
  | 32
  | 58
  | 20
  | 70
  | 78
  | 43
  | 120
  | 93
  | 36
  | 99
  | 66
  | 124
  | 38
  | 117
  | 98
  | 79;
