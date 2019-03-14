import { DEV_SETTINGS }                  from '../developmentSettings';
import { IFactoryLocalization }          from './Factories/interfaces';
import { ChangeEvent }                   from 'react';
import { ISpecialBuildingsLocalization } from './Buildings/interfaces';

const getLocalization = async (component: string, locale = 'en') => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=localization&locale=${locale}&component=${component}`);

  return await response.json() as IFactoryLocalization | ISpecialBuildingsLocalization;
};

const extractChangeEventValue = (event: ChangeEvent): | string => (event.currentTarget as HTMLInputElement).value;

export {
  getLocalization,
  extractChangeEventValue
};
