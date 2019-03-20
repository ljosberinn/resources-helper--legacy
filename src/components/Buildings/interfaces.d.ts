import { ISpecialBuildingState } from '../../types/specialBuildings';

export interface LevelProps {
  level: number;
  placeholderText: string;
  buildingID: number;
}

export interface SpecialBuildingProps {
  data: ISpecialBuildingState;
  name: string;
  placeholderText: string;
}

export interface ISpecialBuildingsLocalization {
  tableColumns: string[];
  specialBuildingNames: string[];
  inputPlaceholder: string;
}
