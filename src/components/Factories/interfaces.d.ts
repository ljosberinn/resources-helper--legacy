import { IFactory } from "../../types/factory";
import { ISpecialBuildingState } from "../../types/specialBuildings";

export interface IFactoryClassState {
  factories: IFactory[];
}

export interface ISpecialBuildingClassState {
  buildings: ISpecialBuildingState[];
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
