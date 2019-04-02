import { setLevel, toggleFactoryDetailsVisibility } from '../actions/Factories';


export interface IFactories {
  [key: string]: IFactory;
}

export interface IFactory {
  id: number;
  level: number;
  scaling: number;
  dependantFactories: readonly number[];
  requirements: IFactoryRequirements[];
  hasDetailsVisible: boolean;
}

export interface IFactoryRequirements {
  id: number;
  amount: number;
  currentAmount: number;
}

export interface FactoryProps {
  data: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

