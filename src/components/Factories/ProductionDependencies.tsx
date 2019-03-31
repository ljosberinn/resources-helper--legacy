import React, { Fragment, memo } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { IFactoryDependency } from '../../types/factory';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  id: number;
  level: number;
  productionDependencies: IFactoryDependency[];
}

const calcDependencyAmount = (amount: number, level: number) =>
  (amount * (Number.isNaN(level) ? 0 : level)).toLocaleString();

const ConnectedProductionDependencies = memo(({ productionDependencies, level }: PropsFromState) => {
  return (
    <Fragment>
      {productionDependencies.map(dependency => {
        const { id, amount } = dependency;

        return (
          <span key={id}>
            <i className={`icon-${id}`} /> {calcDependencyAmount(amount, level)}
          </span>
        );
      })}
    </Fragment>
  );
});

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, { id: ownProps.id });

const preconnect = connect(mapStateToProps);

export const ProductionDependencies = preconnect(ConnectedProductionDependencies);
ConnectedProductionDependencies.displayName = 'ProuctionDependencies';
