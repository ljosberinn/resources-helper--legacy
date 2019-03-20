import * as React from 'react';
import { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { IPreloadedState } from '../../types';
import { IFactoryDependency } from '../../types/factory';
import { filterFactoryByPropsID } from '../helper';

interface PropsFromState {
  id: number;
  level: number;
  dependencies: IFactoryDependency[];
}

const Dependencies: FunctionComponent<PropsFromState> = props => {
  return (
    <React.Fragment>
      {props.dependencies.map(dependency => (
        <span key={dependency.id}>
          {dependency.id} - {(dependency.amount * props.level).toLocaleString()}
        </span>
      ))}
    </React.Fragment>
  );
};

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) =>
  filterFactoryByPropsID(factories, ownProps);

export default connect(mapStateToProps)(Dependencies);
