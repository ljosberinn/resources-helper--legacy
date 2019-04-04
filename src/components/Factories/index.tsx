import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setFactories } from '../../actions/Factories';
import { setPrices, setLastUpdate } from '../../actions/MarketPrices';
import { IPreloadedState } from '../../types';
import { evaluateLoadingAnimationTimeout, getStaticData, getPrices, getElapsedLoadingTime } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { FactoryTable } from './FactoryTable';
import { IFactory } from '../../types/factory';
import { useAsyncEffect } from '../Authentication/Hooks';
import { IMarketPriceState } from '../../types/marketPrices';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  factories: IFactory[];
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setPrices: typeof setPrices;
  setLastUpdate: typeof setLastUpdate;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = memo((props: FactoriesProps) => {
  const { user, marketPrices, factories } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = factories.length === 0;

  useAsyncEffect(async () => {
    if (isLoading && !hasError) {
      (async () => {
        const loadingStart = new Date().getTime();

        const factories = (await getStaticData('factories', setError, setErrorType)) as IFactory[];
        const prices = (await getPrices({ user, marketPrices })) as IMarketPriceState;

        setTimeout(() => {
          props.setPrices(prices);
          props.setFactories(factories);
        }, evaluateLoadingAnimationTimeout(getElapsedLoadingTime(loadingStart)));
      })();
    }
  }, [factories, marketPrices]);

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

const mapStateToProps = (state: IPreloadedState) => ({ factories: state.factories, loading: true });

const mapDispatchToProps = {
  setFactories,
  setPrices,
  setLastUpdate,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
ConnectedFactory.displayName = 'ConnectedFactory';
