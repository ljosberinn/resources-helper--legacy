import { setLevel, toggleFactoryDetailsVisibility } from '../actions/Factories';

export interface IFactory {
  id: FactoryIDs;
  level: number;
  scaling: number;
  dependantFactories: readonly number[];
  requirements: IFactoryRequirements[];
  hasDetailsVisible: boolean;
}

export type FactoryIDs = 6 | 23 | 25 | 29 | 31 | 33 | 34 | 37 | 39 | 52 | 61 | 63 | 68 | 69 | 76 | 80 | 85 | 91 | 95 | 101 | 118 | 125;

export interface IFactoryRequirements {
  id: number;
  amountPerLevel: number;
  currentRequiredAmount: number;
  currentGivenAmount: number;
}

export interface FactoryProps {
  data: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

