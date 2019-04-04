import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setMines } from '../../actions/Mines';
import { IPreloadedState } from '../../types';
import { IMineState } from '../../types/mines';
import { evaluateLoadingAnimationTimeout, getStaticData, getPrices } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { MineTable } from './MineTable';
import { setPrices } from '../../actions/MarketPrices';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setMines: typeof setMines;
  setPrices: typeof setPrices;
}

type MinesProps = PropsFromState & PropsFromDispatch;

const ConnectedMines = memo((props: MinesProps) => {
  const currentStore = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = currentStore.mines.length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      const getMineData = (currentStore: IPreloadedState, props: MinesProps) => {
        const loadingStart = new Date().getMilliseconds();

        const promises = [
          getStaticData(currentStore, 'mines', setError, setErrorType),
          getPrices(currentStore.user.settings.prices.range),
        ];

        Promise.all(promises).then(([mines, prices]) => {
          const timePassed = new Date().getMilliseconds() - loadingStart;

          setTimeout(() => {
            // Redux
            props.setMines(mines);
            props.setPrices(prices);
          }, evaluateLoadingAnimationTimeout(timePassed));
        });
      };

      getMineData(currentStore, props);
    }
  }, [currentStore.mines, currentStore.marketPrices]);

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
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Mines = preconnect(ConnectedMines);
ConnectedMines.displayName = 'ConnectedMines';
