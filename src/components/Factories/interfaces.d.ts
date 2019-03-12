import { IFactory } from '../../types/factory';

export interface IState {
  factories: IFactory[];
}

export interface IFactoryLocalization {
  tableColumns: string[];
  factoryNames: string[];
  inputPlaceholder: string;
}

export interface FactoryProps {
  data: IFactory;
  name: string;
  placeholderText: string;
}

export interface LevelProps {
  level: number;
  placeholderText: string;
  factoryID: number;
}

export interface ScalingProps {
  scaling: number;
  level: number;
}
