import React, { ChangeEvent, FocusEvent, memo } from 'react';
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

const ConnectedLevel = memo((props: LevelProps) => {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);

    props.setLevel(level, props.id);
  };

  return (
    <input
      type={'number'}
      placeholder={'PH'}
      defaultValue={props.level.toString()}
      min={0}
      max={5000}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  );
});

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
ConnectedLevel.displayName = 'Level';
