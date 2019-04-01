import React, { Fragment, memo } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  id: number;
  level: number;
  scaling: number;
}

const calcScaling = (level: number, scaling: number) => scaling * (Number.isNaN(level) ? 0 : level);

const ConnectedScaling = memo(({ level, scaling }: PropsFromState) => <Fragment>{calcScaling(level, scaling)}</Fragment>);

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) => filterFactoryByPropsID(factories, ownProps);

const preconnect = connect(mapStateToProps);

export const Scaling = preconnect(ConnectedScaling);
ConnectedScaling.displayName = 'Scaling';
