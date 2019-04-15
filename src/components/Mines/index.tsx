import React, { useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setMines } from '../../actions/Mines';
import { IPreloadedState } from '../../types';
import { IMineState } from '../../types/mines';
import { evaluateLoadingAnimationTimeout, getStaticData, getElapsedLoadingTime } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { MineTable } from './MineTable';
import { setPrices } from '../../actions/MarketPrices';
import { IMarketPriceState } from '../../types/marketPrices';
import { useAsyncEffect } from '../Hooks';
import { setFactories } from '../../actions/Factories';
import { IFactory } from '../../types/factory';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setMines: typeof setMines;
  setPrices: typeof setPrices;
  setFactories: typeof setFactories;
}

type MinesProps = PropsFromState & PropsFromDispatch;

const ConnectedMines = memo((props: MinesProps) => {
  const { mines, factories, marketPrices } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [isLoading, setIsLoading] = useState(mines.length === 0 || marketPrices.length === 0 || factories.length === 0);

  useAsyncEffect(async () => {
    if (isLoading && !hasError) {
      const loadingStart = new Date().getTime();

      const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];
      const factories = (await getStaticData('factories', setError, setErrorType)) as IFactory[];
      const prices = (await getStaticData('marketPrices', setError, setErrorType)) as IMarketPriceState[];

      setTimeout(() => {
        props.setPrices(prices);
        props.setMines(mines);
        props.setFactories(factories);
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

  return <MineTable />;
});

const mapStateToProps = (state: IPreloadedState) => ({ mines: state.mines });

const mapDispatchToProps = {
  setMines,
  setPrices,
  setFactories,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Mines = preconnect(ConnectedMines);
ConnectedMines.displayName = 'ConnectedMines';
