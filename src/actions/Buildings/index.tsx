import { ISpecialBuildingsLocalization } from '../../components/Buildings/interfaces';
import { ISpecialBuildingState } from '../../types/specialBuildings';
import { action } from 'typesafe-actions';

enum SpecialBuildingActions {
  SET_LEVEL = '@@buildings/SET_LEVEL',
  SET_BUILDINGS = '@@buildings/SET_BUILDINGS',
  SET_LOCALIZATION = '@@buildings/SET_LOCALIZATION',
}

const setLevel = (level: number, buildingID: number) => action(SpecialBuildingActions.SET_LEVEL, { level, buildingID });
const setBuildings = (buildings: ISpecialBuildingState[]) => action(SpecialBuildingActions.SET_BUILDINGS, buildings);
const setLocalization = (type: string, localization: ISpecialBuildingsLocalization) => action(SpecialBuildingActions.SET_LOCALIZATION, { type, localization });

export { SpecialBuildingActions, setLevel, setBuildings, setLocalization };
