import * as React from 'react';
//import { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { filterFactoryByPropsID } from '../helper';

interface PropsFromState {
  id: number;
  level: number;
  scaling: number;
}

const Scaling = (props: PropsFromState) => {
  const value = props.scaling * (Number.isNaN(props.level) ? 0 : props.level);

  return <React.Fragment>{value}</React.Fragment>;
};

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, ownProps);

export default connect(mapStateToProps)(Scaling);
