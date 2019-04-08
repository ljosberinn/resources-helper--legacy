import React, { useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setFactories } from '../../actions/Factories';
import { setPrices } from '../../actions/MarketPrices';
import { IPreloadedState } from '../../types';
import { evaluateLoadingAnimationTimeout, getStaticData, getElapsedLoadingTime } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { FactoryTable } from './FactoryTable';
import { IFactory } from '../../types/factory';
import { IMarketPriceState } from '../../types/marketPrices';
import { setMines } from '../../actions/Mines';
import { IMineState } from '../../types/mines';
import { useAsyncEffect } from '../Hooks';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  factories: IFactory[];
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setPrices: typeof setPrices;
  setMines: typeof setMines;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = memo((props: FactoriesProps) => {
  const { marketPrices, factories, mines } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [isLoading, setIsLoading] = useState(marketPrices.length === 0 || factories.length === 0 || mines.length === 0);

  useAsyncEffect(async () => {
    if (!hasError && isLoading) {
      const loadingStart = new Date().getTime();

      const prices = (await getStaticData('marketPrices', setError, setErrorType)) as IMarketPriceState[];
      const factories = (await getStaticData('factories', setError, setErrorType)) as IFactory[];
      const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];

      setTimeout(() => {
        props.setPrices(prices);
        props.setFactories(factories);
        props.setMines(mines);
        setIsLoading(false);
      }, evaluateLoadingAnimationTimeout(getElapsedLoadingTime(loadingStart)));
    }
  }, []);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <FactoryTable />;
});

const mapStateToProps = (state: IPreloadedState) => ({
  factories: state.factories,
  marketPrices: state.marketPrices,
  mines: state.mines,
});

const mapDispatchToProps = {
  setFactories,
  setPrices,
  setMines,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
ConnectedFactory.displayName = 'ConnectedFactory';
//@ts-ignore
ConnectedFactory.whyDidYouRender = true;
