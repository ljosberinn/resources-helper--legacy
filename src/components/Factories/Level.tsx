import * as React                  from 'react';
import { FunctionComponent }       from 'react';
import { connect }                 from 'react-redux';
import { Dispatch }                from 'redux';
import { setLevel }                from '../../actions/Factories';
import { saveState }               from '../../Store';
import { IPreloadedState }         from '../../types';
import { IFactory }                from '../../types/factory';
import { extractChangeEventValue } from '../helper';

interface PropsFromState {
  level: number;
  placeholderText: string;
  id: number;
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
}

type LevelProps = PropsFromState & PropsFromDispatch;

const Level: FunctionComponent<LevelProps> = props => {

  const { level, placeholderText } = props;

  return (
    <input type={'number'} placeholder={placeholderText} defaultValue={level.toString()} min={0} max={5000} onFocus={e => e.target.select()} onChange={(e) => {
      const level = parseInt(extractChangeEventValue(e));

      props.setLevel(level, props.id);
    }}/>
  );
};

const mapStateToProps = ({ factories }: IPreloadedState, ownProps: PropsFromState) => {
  const { level, id } = factories.find(factory => factory.id === ownProps.id) as IFactory;

  return {
    level,
    id
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setLevel: (level: number, factoryID: number) => dispatch(setLevel(level, factoryID)) && saveState(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Level);
