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
      history: {
        lastCall: 0,
        lastQuery: 0,
      },
    },
  },
  factories: [],
  mines: [],
  specialBuildings: [],
  headquarter: [],
  warehouses: [],
  marketPrices: [],
  localization: {
    factories: { tableColumns: [], factoryNames: [], inputPlaceholder: '' },
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
  const response = await fetch(
    `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=mines`,
  );
  const json: IMineState[] = await response.json();
  preloadedState.mines = json;
})();

export { preloadedState };
