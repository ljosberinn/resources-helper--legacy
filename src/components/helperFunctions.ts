import { Dispatch, SetStateAction } from 'react';
import { DEV_SETTINGS } from '../developmentSettings';
import { IFactory } from '../types/factory';
import { IMineState } from '../types/mines';
import { IMarketPriceState } from '../types/marketPrices';
import { IUserState } from '../types/user';
import { store } from '..';

const uri = DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development;

export const pricesUpdateRequired = (lastUpdate: number) => (new Date().getTime() > new Date(lastUpdate).getTime() - 60 * 60 * 1000);

export const getPrices = async ({ user, marketPrices }: { user: IUserState, marketPrices: IMarketPriceState }) => {

  if (pricesUpdateRequired(user.settings.prices.lastUpdate)) {
    const prices = await abortableAsyncFetch(`${uri}/prices?range=${user.settings.prices.range}`);
    return await prices;
  }

  if(Object.keys(marketPrices).length !== 0) {
    return await marketPrices;
  }
};

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

  return await abortableAsyncFetch(`${uri}/static?type=${component}`, setError, setErrorType);
};

export const abortableAsyncFetch = async (
  url: string,
  setError: Dispatch<SetStateAction<boolean>>|null = null,
  setErrorType: Dispatch<SetStateAction<null>>|null = null,
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
    if(setErrorType) {
      setErrorType(error.name);
    }

    if (setError) {
      setError(true);
    }

    return [];
  }
};

export const filterFactoryByPropsID = (factories: IFactory[], props: { id: number }) =>
  factories.find(factory => factory.id === props.id) as IFactory;

export const getElapsedLoadingTime = (start: number) => new Date().getTime() - start;

// resolve timeout either instantly if loading took longer than LOADING_THRESHOLD
// or resolve it after LOADING_THRESHOLD - timePassed
export const evaluateLoadingAnimationTimeout = (timePassed: number, LOADING_THRESHOLD: number = 750) =>
  timePassed > LOADING_THRESHOLD ? 5 : LOADING_THRESHOLD - timePassed;

/*const calculationOrder : readonly number[] = [
  6, 23, 25, 29, 33, 37, 39, 63, 91, 52, 34, 80, // primary order, relying exclusively on mines
  61, 29, 68, 85, 95, // secondary order, relying both on mines and products
  101, 69, 76, 125, 118 // tertiary order, relying exclusively on products
];*/

export const getMineAmountSum = (mines: IMineState[]) => mines.reduce((sum, currentMine) => sum + currentMine.amount, 0);

export const getHourlyMineIncome = (mines: IMineState[], marketPrices: IMarketPriceState) =>
  mines.reduce((sum, mine) => sum + mine.sumTechRate * marketPrices[mine.resourceID].player, 0).toLocaleString();

export const getFactoryUpgradeSum = (factories: IFactory[]) =>
  factories.reduce((sum, factory) => sum + factory.level, 0);

