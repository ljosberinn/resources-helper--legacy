import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setMines } from '../../actions/Mines';
import { IPreloadedState } from '../../types';
import { IMineState } from '../../types/mines';
import { evaluateLoadingAnimationTimeout, getStaticData } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { MineTable } from './MineTable';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setMines: typeof setMines;
}

type MinesProps = PropsFromState & PropsFromDispatch;

const ConnectedMines = memo((props: MinesProps) => {
  const currentStore = store.getState();

  const [mines, setMines] = useState(currentStore.mines);
  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = Object.keys(mines).length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      const getMineData = (currentStore: IPreloadedState, props: MinesProps) => {
        const loadingStart = new Date().getMilliseconds();

        Promise.resolve(getStaticData(currentStore, 'mines', setError, setErrorType)).then(mines => {
          const timePassed = new Date().getMilliseconds() - loadingStart;

          setTimeout(() => {
            // Redux
            props.setMines(mines);

            // Hooks
            setMines(mines);
          }, evaluateLoadingAnimationTimeout(timePassed));
        });
      };

      getMineData(currentStore, props);
    }
  }, [mines]);

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
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Mines = preconnect(ConnectedMines);
ConnectedMines.displayName = 'ConnectedMines';
