import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setFactories, setLocalization } from '../../actions/Factories';
import { IPreloadedState } from '../../types';
import { store } from '../../index';
import { IFactory } from '../../types/factory';
import { getLocalization, getStaticData } from '../helper';
import LoadingGears from '../Shared/Loading';
import FactoryTable from './FactoryTable';
import { IFactoryLocalization } from './interfaces';

interface PropsFromState {
  loading: boolean;
  factories: IFactory[];
  localization: IFactoryLocalization;
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setLocalization: typeof setLocalization;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const getFactoryData = (
  props: FactoriesProps,
  setLocalization: React.Dispatch<React.SetStateAction<IFactoryLocalization>>,
  setFactories: React.Dispatch<React.SetStateAction<IFactory[]>>,
): void => {
  const currentStore = store.getState();

  Promise.all([getLocalization(currentStore, 'factories'), getStaticData(currentStore, 'factories')]).then(
    fulfilledPromises => {
      const [localization, factories] = fulfilledPromises;

      setTimeout(() => {
        props.setFactories(factories);
        props.setLocalization('factories', localization);

        setLocalization(localization);
        setFactories(factories);
      }, 750);
    },
  );
};

const Factories: React.FunctionComponent<FactoriesProps> = props => {
  const { factories, localization } = store.getState();

  const [factoryData, setFactories] = React.useState<IFactory[]>(factories);
  const [factoryLocalization, setLocalization] = React.useState<IFactoryLocalization>(localization.factories);

  const isUninitialized = factoryData.length === 0 && factoryLocalization.factoryNames.length === 0;

  React.useEffect(() => {
    if (isUninitialized) {
      getFactoryData(props, setLocalization, setFactories);
    }
  }, [factoryData, factoryLocalization]);

  if (isUninitialized) {
    return <LoadingGears />;
  }

  return <FactoryTable localization={factoryLocalization} factories={factoryData} />;
};

const mapStateToProps = (state: IPreloadedState) => ({ ...state.factories });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFactories: (factories: IFactory[]) => dispatch(setFactories(factories)),
  setLocalization: (type: string, localization: IFactoryLocalization) => dispatch(setLocalization(type, localization)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Factories);
