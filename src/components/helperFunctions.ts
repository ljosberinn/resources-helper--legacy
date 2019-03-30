import { Dispatch, SetStateAction } from 'react';
import { DEV_SETTINGS } from '../developmentSettings';
import { IPreloadedState } from '../types';
import { IFactories, IFactory } from '../types/factory';

const getStaticData = async (
  state: IPreloadedState,
  component: string,
  setError: Dispatch<SetStateAction<boolean>>,
  setErrorType: Dispatch<SetStateAction<string>>,
) => {
  // @ts-ignore
  if (state[component].length > 0) {
    // @ts-ignore
    return await state[component];
  }

  const uri = DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development;

  return await abortableAsyncFetch(`${uri}/static?type=${component}`, setError, setErrorType);
};

const abortableAsyncFetch = async (
  url: string,
  setError: Dispatch<SetStateAction<boolean>>,
  setErrorType: Dispatch<SetStateAction<string>>,
) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;

    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal });

    if (!response.ok) {
      clearTimeout(timeout);
      throw Error(response.statusText);
    }

    const json = await response.json();
    clearTimeout(timeout);

    return json as IFactory[];
  } catch (error) {
    setErrorType(error.name);
    setError(true);
    return [];
  }
};

const filterFactoryByPropsID = (factories: IFactories, props: { id: number }) =>
  Object.values(factories).find(factory => factory.id === props.id) as IFactory;

// resolve timeout either instantly if loading took longer than LOADING_THRESHOLD
// or resolve it after LOADING_THRESHOLD - timePassed
const evaluateLoadingAnimationTimeout = (timePassed: number, LOADING_THRESHOLD: number = 750) =>
  timePassed > LOADING_THRESHOLD ? 5 : LOADING_THRESHOLD - timePassed;

export { getStaticData, filterFactoryByPropsID, evaluateLoadingAnimationTimeout };
