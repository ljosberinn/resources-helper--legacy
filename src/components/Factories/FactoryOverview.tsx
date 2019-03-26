import React, { MouseEvent, memo } from 'react';
import { FactoryProps } from '../../types/factory';
import { ProductionDependencies } from './ProductionDependencies';
import { Level } from './Level';
import { Scaling } from './Scaling';
import { toggleFactoryDetailsVisibility } from '../../actions/Factories';
import { filterFactoryByPropsID } from '../helperFunctions';
import { IPreloadedState } from '../../types';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

interface PropsFromState extends FactoryProps {}

interface PropsFromDispatch {
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

type IFactoryOverview = PropsFromState & PropsFromDispatch;

const toggleDetails = (
  event: MouseEvent<HTMLButtonElement>,
  id: number,
  dispatchFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility,
) => {
  const parentTR = event.currentTarget.closest('tr') as HTMLTableRowElement;
  const detailsTR = parentTR.nextElementSibling as HTMLTableRowElement;

  detailsTR.hidden = !detailsTR.hidden;

  dispatchFactoryDetailsVisibility(id);
};

const ConnectedFactoryOverview = ({ data, toggleFactoryDetailsVisibility }: IFactoryOverview) => (
  <tr>
    <td>ID {data.id}</td>
    <td>
      <Level id={data.id} level={data.level} />
    </td>
    <td>
      <Scaling id={data.id} scaling={data.scaling} level={data.level} />
    </td>
    <td>
      <ProductionDependencies {...data} />
    </td>
    <td>Workload</td>
    <td>Turnover</td>
    <td>Turnover Increase per Upgrade</td>
    <td>Upgrade Cost</td>
    <td>GD Order Indicator</td>
    <td>
      <button onClick={(e: MouseEvent<HTMLButtonElement>) => toggleDetails(e, data.id, toggleFactoryDetailsVisibility)}>
        Details
      </button>
    </td>
  </tr>
);

const mapStateToProps = ({ factories }: IPreloadedState, { data }: PropsFromState) =>
  filterFactoryByPropsID(factories, data);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleFactoryDetailsVisibility: (factoryID: number) => dispatch(toggleFactoryDetailsVisibility(factoryID)),
});

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const FactoryOverview = preconnect(ConnectedFactoryOverview);
