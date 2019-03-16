import * as React                         from 'react';
import { connect }                        from 'react-redux';
import { Dispatch }                       from 'redux';
import { saveState, store }               from '../../Store';
import { IPreloadedState }                from '../../types';
import { IFactory }                       from '../../types/factory';
import Factory                            from './Factory';
import LoadingGears                       from '../Shared/Loading';
import { IFactoryLocalization }           from './interfaces';
import { setFactories, setLocalization }  from '../../actions/Factories';
import { getLocalization, getStaticData } from '../helper';

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

class Factories extends React.Component<FactoriesProps> {
  public state = {
    loading     : true,
    factories   : [] as IFactory[],
    localization: {} as IFactoryLocalization,
  };

  public componentDidMount(): void {
    const currentStore = store.getState();

    Promise.all([getLocalization(currentStore, 'factories'), getStaticData(currentStore, 'factories')]).then(fulfilledPromises => {
      const [localization, factories] = fulfilledPromises;

      this.props.setFactories(factories);
      this.props.setLocalization('factories', localization);
      this.setState({ localization, factories, loading: false });
      saveState();
    });
  }

  public render() {

    const { loading, localization, factories } = this.state;

    if (loading) {
      return (
        <LoadingGears/>
      );
    }

    return (
      <table>
        <thead>
        <tr>
          {
            localization.tableColumns.map(th => <th key={localization.tableColumns.indexOf(th)}>{th}</th>)
          }
        </tr>
        </thead>
        <tbody>
        <React.Fragment>
          {
            factories.map(factory => <Factory key={factory.id} data={factory}
                                              name={localization.factoryNames[factory.id]}
                                              placeholderText={localization.inputPlaceholder}/>)
          }
        </React.Fragment>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state: IPreloadedState) => ({ ...state.factories });
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFactories   : (factories: IFactory[]) => dispatch(setFactories(factories)),
  setLocalization: (type: string, localization: IFactoryLocalization) => dispatch(setLocalization(type, localization)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Factories);
