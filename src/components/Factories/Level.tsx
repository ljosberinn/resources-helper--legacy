import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setLevel } from '../../actions/Factories';
import { IPreloadedState } from '../../types';
import { filterFactoryByPropsID } from '../helperFunctions';

interface PropsFromState {
  level: number;
  id: number;
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
}

type LevelProps = PropsFromState & PropsFromDispatch;

const getLevelAttributes = (props: LevelProps) => ({
  type: 'number',
  placeholder: 'PH',
  defaultValue: props.level.toString(),
  min: 0,
  max: 5000,
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);

    props.setLevel(level, props.id);
  },
});

const ConnectedLevel = (props: LevelProps) => <input {...getLevelAttributes(props)} />;

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) => {
  const { level, id } = filterFactoryByPropsID(factories, ownProps);

  return { level, id };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setLevel: (level: number, factoryID: number) => dispatch(setLevel(level, factoryID)),
});

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const Level = preconnect(ConnectedLevel);
