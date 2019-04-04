import { action } from 'typesafe-actions';
import { IMarketPriceState } from '../../types/marketPrices';

export enum MarketPriceActions {
  SET_PRICES = '@@marketPrices/SET_PRICES',
  SET_LAST_UPDATE = '@@marketPrices/SET_LAST_UPDATE',
}

export const setPrices = (prices: IMarketPriceState) => action(MarketPriceActions.SET_PRICES, prices);
export const setLastUpdate = (lastUpdate: number) => action(MarketPriceActions.SET_LAST_UPDATE, lastUpdate);
