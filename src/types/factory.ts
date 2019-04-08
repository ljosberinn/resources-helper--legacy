import { setLevel, toggleFactoryDetailsVisibility } from '../actions/Factories';

export interface IFactory {
  readonly id: FactoryIDs;
  readonly productID: ProductIDs;
  readonly scaling: number;
  readonly dependantFactories: FactoryIDs[];

  level: number;
  productionRequirements: IFactoryRequirements[];
  upgradeRequirements: IFactoryUpgradeRequirements[];
  hasDetailsVisible: boolean;
}

interface IFactoryUpgradeRequirements {}

export type ProductIDs =
  | 7
  | 22
  | 24
  | 28
  | 30
  | 32
  | 35
  | 36
  | 38
  | 51
  | 60
  | 58
  | 67
  | 66
  | 75
  | 79
  | 84
  | 93
  | 92
  | 87
  | 117
  | 124;

export type FactoryIDs =
  | 6
  | 23
  | 25
  | 29
  | 31
  | 33
  | 34
  | 37
  | 39
  | 52
  | 61
  | 63
  | 68
  | 69
  | 76
  | 80
  | 85
  | 91
  | 95
  | 101
  | 118
  | 125;

export interface IFactoryRequirements {
  readonly id: number;
  readonly amountPerLevel: number;

  currentRequiredAmount: number;
  currentGivenAmount: number;
}

export interface FactoryProps {
  data: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}
