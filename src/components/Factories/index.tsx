import React, { useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setFactories } from '../../actions/Factories';
import { setPrices, setLastUpdate } from '../../actions/MarketPrices';
import { IPreloadedState } from '../../types';
import { evaluateLoadingAnimationTimeout, getStaticData, getPrices, getElapsedLoadingTime } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { FactoryTable } from './FactoryTable';
import { IFactory } from '../../types/factory';
import { useAsyncEffect } from '../Hooks';
import { IMarketPriceState } from '../../types/marketPrices';
import { setMines } from '../../actions/Mines';
import { IMineState } from '../../types/mines';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  factories: IFactory[];
  mines: IMineState[];
  marketPrices: IMarketPriceState;
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setPrices: typeof setPrices;
  setLastUpdate: typeof setLastUpdate;
  setMines: typeof setMines;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = memo((props: FactoriesProps) => {
  const { user, marketPrices, factories, mines } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = factories.length === 0;

  useAsyncEffect(async () => {
    if (isLoading && !hasError) {
      (async () => {
        const loadingStart = new Date().getTime();

        const factories = (await getStaticData('factories', setError, setErrorType)) as IFactory[];
        const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];
        const prices = (await getPrices({ user, marketPrices })) as IMarketPriceState;

        setTimeout(() => {
          props.setPrices(prices);
          props.setMines(mines);
          props.setFactories(factories);
        }, evaluateLoadingAnimationTimeout(getElapsedLoadingTime(loadingStart)));
      })();
    }
  }, [factories, mines, marketPrices]);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <FactoryTable marketPrices={marketPrices} />;
});

const mapStateToProps = (state: IPreloadedState) => ({
  factories: state.factories,
  mines: state.mines,
  marketPrices: state.marketPrices,
});

const mapDispatchToProps = {
  setFactories,
  setPrices,
  setMines,
  setLastUpdate,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
ConnectedFactory.displayName = 'ConnectedFactory';
//@ts-ignore
ConnectedFactory.whyDidYouRender = true;
