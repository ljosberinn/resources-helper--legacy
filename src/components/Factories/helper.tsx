import { DEV_SETTINGS }         from '../../developmentSettings';
import { IFactory }             from '../../types/factory';

const getFactoryData = async () => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=factories`);

  return await response.json() as IFactory[];
};

export {
  getFactoryData
};
