import { IPreloadedState } from '../types';
import { FactoryIDs } from '../types/factory';
import { ResourceIDs } from '../types/mines';

export const preloadedState: IPreloadedState = {
  version: '4.0.0',
  user: {
    isAuthenticated: false,
    settings: {
      remembersAPIKey: false,
      locale: 'en',
      prices: {
        type: 'json',
        range: 72,
      },
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
        marketPrices: 0,
      },
    },
  },
  factories: [],
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

export const FACTORY_CALCULATION_ORDER: FactoryIDs[] = [
  6,
  23,
  25,
  31,
  33,
  34,
  37,
  39,
  52,
  63,
  80,
  91,
  // secondary order, relying on mines and products
  29,
  61,
  68,
  69,
  85,
  // tertiary order, relying on products of other factories
  76,
  95,
  101,
  118,
  125,
];

export const MINE_ORDER: ResourceIDs[] = [2, 20, 3, 13, 8, 10, 53, 26, 12, 90, 49, 15, 14, 81];
