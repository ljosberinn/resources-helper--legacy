import { DEV_SETTINGS }          from '../../developmentSettings';
import { ISpecialBuildingState } from '../../types/specialBuildings';

const getSpecialBuildingData = async () => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=specialBuildings`);

  return await response.json() as ISpecialBuildingState[];
};

export {
  getSpecialBuildingData
};
