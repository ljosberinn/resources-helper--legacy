import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setMines } from '../../actions/Mines';
import { IPreloadedState } from '../../types';
import { IMineState } from '../../types/mines';
import {
  evaluateLoadingAnimationTimeout,
  getStaticData,
  getPrices,
  getElapsedLoadingTime,
  pricesUpdateRequired,
} from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { MineTable } from './MineTable';
import { setPrices, setLastUpdate } from '../../actions/MarketPrices';
import { IMarketPriceState } from '../../types/marketPrices';
import { useAsyncEffect } from '../Authentication/Hooks';
import { async } from 'q';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setMines: typeof setMines;
  setPrices: typeof setPrices;
  setLastUpdate: typeof setLastUpdate;
}

type MinesProps = PropsFromState & PropsFromDispatch;

const ConnectedMines = memo((props: MinesProps) => {
  const { user, mines, marketPrices } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = mines.length === 0;

  useAsyncEffect(async () => {
    if (isLoading && !hasError) {
      (async () => {
        const loadingStart = new Date().getTime();

        const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];
        const prices = (await getPrices({ user, marketPrices })) as IMarketPriceState;

        setTimeout(() => {
          props.setPrices(prices);
          props.setLastUpdate(new Date().getTime());
          props.setMines(mines);
        }, evaluateLoadingAnimationTimeout(getElapsedLoadingTime(loadingStart)));
      })();
    }
  }, [mines, marketPrices]);

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

const mapStateToProps = (state: IPreloadedState) => ({ mines: state.mines, loading: true });

const mapDispatchToProps = {
  setMines,
  setPrices,
  setLastUpdate,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Mines = preconnect(ConnectedMines);
ConnectedMines.displayName = 'ConnectedMines';
