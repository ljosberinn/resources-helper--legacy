import { IPreloadedState } from '../types';

export const preloadedState: IPreloadedState = {
  version: '4.0.0',
  user: {
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
      isAPIUser: false,
      key: '',
      lastUpdates: {
        factories: 0,
        specialBuildings: 0,
        mines: 0,
        warehouses: 0,
        tradeLog: 0,
        combatLog: 0,
        headquarter: 0,
      },
    },
  },
  factories: {},
  mines: [],
  specialBuildings: [],
  headquarter: [],
  warehouses: [],
  marketPrices: [],
  companyWorth: {
    headquarter: 0,
    factories: 0,
    specialBuildings: 0,
    mines: 0,
    warehouses: 0,
  },
};
