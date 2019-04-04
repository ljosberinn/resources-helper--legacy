import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { store } from '../..';
import { setFactories } from '../../actions/Factories';
import { setPrices } from '../../actions/MarketPrices';
import { IPreloadedState } from '../../types';
import { evaluateLoadingAnimationTimeout, getStaticData, getPrices } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { FactoryTable } from './FactoryTable';
import { IFactory } from '../../types/factory';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  factories: IFactory[];
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setPrices: typeof setPrices;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = memo((props: FactoriesProps) => {
  const currentStore = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = currentStore.factories.length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      const getFactoryData = (currentStore: IPreloadedState, props: FactoriesProps) => {
        const loadingStart = new Date().getMilliseconds();

        const promises = [
          getStaticData(currentStore, 'factories', setError, setErrorType),
          getPrices(currentStore.user.settings.prices.range),
        ];

        Promise.all(promises).then(([factories, prices]) => {
          const timePassed = new Date().getMilliseconds() - loadingStart;

          setTimeout(() => {
            // Redux
            props.setPrices(prices);
            props.setFactories(factories);

            // Hooks
            //setFactories(factories);
          }, evaluateLoadingAnimationTimeout(timePassed));
        });
      };

      getFactoryData(currentStore, props);
    }
  }, [currentStore.factories]);

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
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
ConnectedFactory.displayName = 'ConnectedFactory';
