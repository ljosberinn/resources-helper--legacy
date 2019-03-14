import * as React                                   from 'react';
import { IFactory }                                 from '../../types/factory';
import Factory                                      from './Factory';
import LoadingGears                                 from '../Shared/Loading';
import { IFactoryLocalization, IFactoryClassState } from './interfaces';
import { getFactoryData }                           from './helper';
import { store }                                    from '../../Store';
import { setFactories }                             from '../../actions/Factories';
import { getLocalization }                          from '../helper';

class Factories extends React.Component {
  state = {
    loading     : true,
    factories   : [] as IFactory[],
    localization: {} as IFactoryLocalization,
  };

  public constructor(state: IFactoryClassState) {
    super(state);
  }

  componentDidMount(): void {
    Promise.all([getLocalization('factories'), getFactoryData()]).then(fulfilledPromises => {
      const [localization, factories] = fulfilledPromises;

      store.dispatch(setFactories(factories));
      this.setState({ localization, factories, loading: false });
    });
  }

  render() {

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

export default Factories;
