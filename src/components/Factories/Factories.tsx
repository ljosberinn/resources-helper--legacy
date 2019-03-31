import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { store } from '../..';
import { setFactories } from '../../actions/Factories';
import { IPreloadedState } from '../../types';
import { IFactories } from '../../types/factory';
import { evaluateLoadingAnimationTimeout, getStaticData } from '../helperFunctions';
import { Loading } from '../Shared/Loading';
import { FactoryTable } from './FactoryTable';

interface PropsFromState {
  hasError: boolean;
  errorType: string;
  factories: IFactories;
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = memo((props: FactoriesProps) => {
  const currentStore = store.getState();

  const [factories, setFactories] = useState(currentStore.factories);
  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const isLoading = Object.keys(factories).length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      const getFactoryData = (currentStore: IPreloadedState, props: FactoriesProps) => {
        const loadingStart = new Date().getMilliseconds();

        Promise.resolve(getStaticData(currentStore, 'factories', setError, setErrorType)).then(factories => {
          const timePassed = new Date().getMilliseconds() - loadingStart;

          setTimeout(() => {
            // Redux
            props.setFactories(factories);

            // Hooks
            setFactories(factories);
          }, evaluateLoadingAnimationTimeout(timePassed));
        });
      };

      getFactoryData(currentStore, props);
    }
  }, [factories]);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <FactoryTable factories={factories} />;
});

const mapStateToProps = (state: IPreloadedState) => ({ factories: state.factories, loading: true });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFactories: (factories: IFactories) => dispatch(setFactories(factories)),
});

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
ConnectedFactory.displayName = 'ConnectedFactory';
