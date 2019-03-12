import { DEV_SETTINGS }         from '../../developmentSettings';
import { IFactory }             from '../../types/factory';
import { IFactoryLocalization } from './interfaces';
import { ChangeEvent }          from 'react';

const getFactoryData = async () => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=factories`);

  return await response.json() as IFactory[];
};

const getLocalization = async (locale = 'en') => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=localization&locale=${locale}&component=factories`);

  return await response.json() as IFactoryLocalization;
};

const extractChangeEventValue = (event: ChangeEvent): | string => (event.currentTarget as HTMLInputElement).value;

export {
  getFactoryData,
  getLocalization,
  extractChangeEventValue
};
