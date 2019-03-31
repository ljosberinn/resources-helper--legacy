import React, { Fragment, memo } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  id: number;
  level: number;
  scaling: number;
}

const ConnectedScaling = memo(({ level, scaling }: PropsFromState) => {
  const value = scaling * (Number.isNaN(level) ? 0 : level);

  return <Fragment>{value}</Fragment>;
});

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, ownProps);

const preconnect = connect(mapStateToProps);

export const Scaling = preconnect(ConnectedScaling);
ConnectedScaling.displayName = 'Scaling';
