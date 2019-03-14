import * as React                        from 'react';
import LoadingGears                      from '../Shared/Loading';
import { store }                         from '../../Store';
import { ISpecialBuildingState }         from '../../types/specialBuildings';
import { setBuildings }                  from '../../actions/Buildings';
import { getLocalization }               from '../helper';
import { ISpecialBuildingClassState }    from '../Factories/interfaces';
import { getSpecialBuildingData }        from './helper';
import SpecialBuilding                   from './SpecialBuilding';
import { ISpecialBuildingsLocalization } from './interfaces';

class SpecialBuildings extends React.Component {
  state = {
    loading         : true,
    specialBuildings: [] as ISpecialBuildingState[],
    localization    : {} as ISpecialBuildingsLocalization,
  };

  public constructor(state: ISpecialBuildingClassState) {
    super(state);
  }

  componentDidMount(): void {
    Promise.all([getLocalization('specialBuildings'), getSpecialBuildingData()]).then(fulfilledPromises => {
      const [localization, specialBuildings] = fulfilledPromises;

      store.dispatch(setBuildings(specialBuildings));
      this.setState({ localization, specialBuildings, loading: false });
    });
  }

  render() {

    const { loading, localization, specialBuildings } = this.state;

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
            specialBuildings.map(building => <SpecialBuilding key={building.id} data={building}
                                                              name={localization.specialBuildingNames[building.id]}
                                                              placeholderText={localization.inputPlaceholder}/>)
          }
        </React.Fragment>
        </tbody>
      </table>
    );
  }
}

export default SpecialBuildings;
