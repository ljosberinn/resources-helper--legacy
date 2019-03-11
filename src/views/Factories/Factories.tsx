import * as React       from 'react';
import { IFactory }     from '../../types/factory';
import { DEV_SETTINGS } from '../../developmentSettings';
import Factory          from './Factory';
import LoadingGears     from '../Shared/Loading';

interface IState {
  factories: IFactory[];
}

interface IFactoryLocalization {
  tableColumns: string[];
  factoryNames: string[];
  inputPlaceholder: string;
}

const getFactoryData = async () => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=factories`);

  return await response.json() as IFactory[];
};

const getLocalization = async (locale = 'en') => {
  const response = await fetch(`${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/static/?type=localization&locale=${locale}&component=factories`);

  return await response.json() as IFactoryLocalization;
};

class Factories extends React.Component {
  state = {
    loading     : true,
    factories   : [] as IFactory[],
    localization: {} as IFactoryLocalization,
  };


  public constructor(state: IState) {
    super(state);
  }

  componentDidMount(): void {
    Promise.all([getLocalization(), getFactoryData()]).then(fulfilledPromises => {
      const [localization, factories] = fulfilledPromises;

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
