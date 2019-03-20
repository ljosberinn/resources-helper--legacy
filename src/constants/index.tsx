import { DEV_SETTINGS } from '../developmentSettings';
import { IPreloadedState } from '../types';
import { IMineState } from '../types/mines';

const preloadedState: IPreloadedState = {
  version: '4.0.0',
  user: {
    isAPIUser: false,
    isAuthenticated: false,
    settings: {
      remembersAPIKey: false,
      locale: 'en',
    },
    playerInfo: {
      userName: '',
      level: 0,
      rank: 0,
      registered: 0,
    },
    API: {
      key: '',
      lastAPICall: 0,
      userAPIStatistics: [
        { id: 0, lastCall: 0, amount: 0 },
        { id: 1, lastCall: 0, amount: 0 },
        { id: 2, lastCall: 0, amount: 0 },
        { id: 3, lastCall: 0, amount: 0 },
        { id: 4, lastCall: 0, amount: 0 },
        { id: 5, lastCall: 0, amount: 0 },
        { id: 51, lastCall: 0, amount: 0 },
        { id: 6, lastCall: 0, amount: 0 },
        { id: 7, lastCall: 0, amount: 0 },
        { id: 8, lastCall: 0, amount: 0 },
        { id: 9, lastCall: 0, amount: 0 },
        { id: 10, lastCall: 0, amount: 0 },
      ],
    },
  },
  factories: [],
  mines: [],
  specialBuildings: [],
  headquarter: [],
  warehouses: [],
  marketPrices: [],
  localization: {
    factories: [],
    specialBuildings: [],
    headquarter: [],
    mines: [],
    warehouses: [],
  },
  companyWorth: {
    headquarter: 0,
    factories: 0,
    specialBuildings: 0,
    mines: 0,
    warehouses: 0,
  },
};

(async () => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=mines`);
  const json: IMineState[] = await response.json();
  preloadedState.mines = json;
})();

export { preloadedState };
