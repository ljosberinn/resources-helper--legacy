import { FactoryIDs, ProductIDs } from './../types/factory';
import { Dispatch, SetStateAction } from 'react';
import { DEV_SETTINGS } from '../developmentSettings';
import { IFactory } from '../types/factory';
import { IMineState, ResourceIDs } from '../types/mines';
import { IMarketPriceState } from '../types/marketPrices';
import { store } from '..';

const uri = DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development;

export const getStaticData = async (
  component: string,
  setError: Dispatch<SetStateAction<boolean>>,
  setErrorType: Dispatch<SetStateAction<null>>,
) => {
  const currentStore = store.getState();
  // @ts-ignore
  if (currentStore[component].length > 0) {
    // @ts-ignore
    return await currentStore[component];
  }

  return await abortableAsyncFetch(`${uri}/${component}`, setError, setErrorType);
};

export const abortableAsyncFetch = async (
  url: string,
  setError: Dispatch<SetStateAction<boolean>> | null = null,
  setErrorType: Dispatch<SetStateAction<null>> | null = null,
) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;

    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(url, { signal });

    if (!response.ok) {
      clearTimeout(timeout);
      throw Error(response.statusText);
    }

    const json = await response.json();
    clearTimeout(timeout);

    return json as IFactory[] | IMineState[] | IMarketPriceState;
  } catch (error) {
    if (setErrorType) {
      setErrorType(error.name);
    }

    if (setError) {
      setError(true);
    }

    return [];
  }
};

export const getElapsedLoadingTime = (start: number) => new Date().getTime() - start;

// resolve timeout either instantly if loading took longer than LOADING_THRESHOLD
// or resolve it after LOADING_THRESHOLD - timePassed
export const evaluateLoadingAnimationTimeout = (timePassed: number, LOADING_THRESHOLD: number = 750) =>
  timePassed > LOADING_THRESHOLD ? 5 : LOADING_THRESHOLD - timePassed;

export const calculationOrder: FactoryIDs[] = [
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

export const mineOrder: ResourceIDs[] = [2, 20, 3, 13, 8, 10, 53, 26, 12, 90, 49, 15, 14, 81];

export const getMineByID = (mines: IMineState[], id: ResourceIDs) =>
  mines.find(mine => mine.resourceID === id) as IMineState;

export const getPricesByID = (marketPrices: IMarketPriceState[], id: ResourceIDs | FactoryIDs | ProductIDs) =>
  marketPrices.find(price => price.id === id) as IMarketPriceState;

export const getFactoryByID = (factories: IFactory[], id: FactoryIDs) =>
  factories.find(factory => factory.id === id) as IFactory;

export const getMineAmountSum = (mines: IMineState[]) =>
  mines.reduce((sum, currentMine) => sum + currentMine.amount, 0);

export const getHourlyMineIncome = (mines: IMineState[], marketPrices: IMarketPriceState[]) =>
  mines
    .reduce((sum, mine) => {
      const { ai, player } = getPricesByID(marketPrices, mine.resourceID);

      return sum + mine.sumTechRate * (player > 0 ? player : ai);
    }, 0)
    .toLocaleString();

export const getFactoryUpgradeSum = (factories: IFactory[]) =>
  factories.reduce((sum, factory) => sum + factory.level, 0);
