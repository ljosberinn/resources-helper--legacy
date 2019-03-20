/*import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setBuildings, setLocalization } from '../../actions/Buildings';
import { saveState, store } from '../../Store';
import { IPreloadedState } from '../../types';
import { ISpecialBuildingState } from '../../types/specialBuildings';
import { getLocalization, getStaticData } from '../helper';
import LoadingGears from '../Shared/Loading';
import { ISpecialBuildingsLocalization } from './interfaces';
import SpecialBuilding from './SpecialBuilding';

interface PropsFromState {
  loading: boolean;
  specialBuildings: ISpecialBuildingState[];
  localization: ISpecialBuildingsLocalization;
}

interface PropsFromDispatch {
  setBuildings: typeof setBuildings;
  setLocalization: typeof setLocalization;
}

type SpecialBuildingsProps = PropsFromState & PropsFromDispatch;

class SpecialBuildings extends React.Component<SpecialBuildingsProps> {
  public state = {
    loading: true,
    specialBuildings: [] as ISpecialBuildingState[],
    localization: {} as ISpecialBuildingsLocalization,
  };

  public componentDidMount(): void {
    const currentState = store.getState();

    Promise.all([getLocalization(currentState, 'specialBuildings'), getStaticData(currentState, 'specialBuildings')]).then(fulfilledPromises => {
      const [localization, specialBuildings] = fulfilledPromises;

      this.props.setBuildings(specialBuildings);
      this.props.setLocalization('specialBuildings', localization);
      this.setState({ localization, specialBuildings, loading: false });
      saveState();
    });
  }

  public render() {
    const { loading, localization, specialBuildings } = this.state;

    if (loading) {
      return <LoadingGears />;
    }
    return (
      <table>
        <thead>
          <tr>
            {localization.tableColumns.map(th => (
              <th key={localization.tableColumns.indexOf(th)}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <React.Fragment>
            {specialBuildings.map(building => (
              <SpecialBuilding data={building} name={localization.specialBuildingNames[building.id]} placeholderText={localization.inputPlaceholder} key={building.id} />
            ))}
          </React.Fragment>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state: IPreloadedState) => ({ ...state.specialBuildings });
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setBuildings: (buildings: ISpecialBuildingState[]) => dispatch(setBuildings(buildings)),
  setLocalization: (type: string, localization: ISpecialBuildingsLocalization) => dispatch(setLocalization(type, localization)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpecialBuildings);*/
