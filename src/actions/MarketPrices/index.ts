import { action } from 'typesafe-actions';
import { IMarketPriceState } from '../../types/marketPrices';

export enum MarketPriceActions {
  SET_PRICES = '@@marketPrices/SET_PRICES',
}

export const setPrices = (prices: IMarketPriceState[]) => action(MarketPriceActions.SET_PRICES, prices);
