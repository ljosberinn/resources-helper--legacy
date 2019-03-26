import React, { SetStateAction, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setFactories } from '../../actions/Factories';
import { store } from '../../index';
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

const getFactoryData = (
  currentStore: IPreloadedState,
  props: FactoriesProps,
  setFactories: React.Dispatch<SetStateAction<IFactories>>,
  setError: React.Dispatch<SetStateAction<boolean>>,
  setErrorType: React.Dispatch<SetStateAction<string>>,
) => {
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

const ConnectedFactory = (props: FactoriesProps) => {
  const currentStore = store.getState();
  const { factories } = currentStore;

  const [factoryData, setFactories] = useState(factories);
  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState('');

  const isLoading = Object.keys(factories).length === 0;

  useEffect(() => {
    if (isLoading && !hasError) {
      getFactoryData(currentStore, props, setFactories, setError, setErrorType);
    }
  }, [factoryData]);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <FactoryTable factories={factoryData} />;
};

const mapStateToProps = (state: IPreloadedState) => ({ factories: state.factories, loading: true });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFactories: (factories: IFactories) => dispatch(setFactories(factories)),
});

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Factories = preconnect(ConnectedFactory);
