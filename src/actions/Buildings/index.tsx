import { ISpecialBuildingState } from '../../types/specialBuildings';

enum SpecialBuildingActions {
  setLevel     = 'SET_BUILDING_LEVEL',
  setBuildings = 'SET_BUILDINGS',
}

interface ISetBuildingLevelAction {
  type: SpecialBuildingActions.setLevel,
  level: number;
  buildingID: number;
}

interface ISetBuildings {
  type: SpecialBuildingActions.setBuildings;
  buildings: ISpecialBuildingState[];
}

type SpecialBuildingActionType = ISetBuildingLevelAction | ISetBuildings;

const setLevel = (level: number, buildingID: number): ISetBuildingLevelAction => ({ type: SpecialBuildingActions.setLevel, level, buildingID, });
const setBuildings = (buildings: ISpecialBuildingState[]) => ({ type: SpecialBuildingActions.setBuildings, buildings: [...buildings] });

export {
  SpecialBuildingActions,
  SpecialBuildingActionType,
  setLevel,
  setBuildings
};
