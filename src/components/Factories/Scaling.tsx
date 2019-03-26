import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  id: number;
  level: number;
  scaling: number;
}

const ConnectedScaling = (props: PropsFromState) => {
  const value = props.scaling * (Number.isNaN(props.level) ? 0 : props.level);

  return <Fragment>{value}</Fragment>;
};

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, ownProps);

const preconnect = connect(mapStateToProps);

export const Scaling = preconnect(ConnectedScaling);
