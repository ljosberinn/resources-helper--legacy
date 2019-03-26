import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { IFactoryDependency } from '../../types/factory';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  id: number;
  level: number;
  productionDependencies: IFactoryDependency[];
}

const ConnectedProductionDependencies = ({ productionDependencies, level, id }: PropsFromState) => (
  <Fragment>
    {productionDependencies.map(dependency => (
      <span key={dependency.id}>
        <i className={`icon-${dependency.id}`} /> {(dependency.amount * level).toLocaleString()}
      </span>
    ))}
  </Fragment>
);

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, { id: ownProps.id });

const preconnect = connect(mapStateToProps);

export const ProductionDependencies = preconnect(ConnectedProductionDependencies);
