import { setLevel, toggleFactoryDetailsVisibility } from '../actions/Factories';
import { ResourceIDs } from './mines';

export interface IFactory {
  readonly id: FactoryIDs;
  readonly productID: ProductIDs;
  readonly scaling: FactoryScalings;
  readonly dependantFactories: FactoryIDs[];

  level: number;
  productionRequirements: IFactoryProductionRequirements[];
  upgradeRequirements: IFactoryUpgradeRequirements[];
  hasDetailsVisible: boolean;
}

interface IFactoryUpgradeRequirements {}

export type FactoryScalings =
  | 2100
  | 1210
  | 80
  | 3500
  | 450
  | 320
  | 3000
  | 270
  | 640
  | 320
  | 640
  | 1800
  | 120
  | 480
  | 400
  | 240
  | 100
  | 750
  | 600
  | 125
  | 1
  | 100;

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

export interface IFactoryProductionRequirements {
  readonly id: ResourceIDs | ProductIDs | 1;
  readonly amountPerLevel: number;

  currentRequiredAmount: number;
  currentGivenAmount: number;
}

export interface FactoryProps {
  data: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}
