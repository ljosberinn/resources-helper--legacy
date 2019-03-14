import * as React                  from 'react';
import { FunctionComponent }       from 'react';
import { ChangeEvent }             from 'react';
import { store }                   from '../../Store';
import { setLevel }                from '../../actions/Buildings';
import { extractChangeEventValue } from '../helper';
import { LevelProps }              from './interfaces';

const updateState = (e: ChangeEvent, buildingID: number) => {
  const level = parseInt(extractChangeEventValue(e));

  store.dispatch(setLevel(level, buildingID));
};

const Level: FunctionComponent<LevelProps> = (props: LevelProps) => {

  const { level, placeholderText, buildingID } = props;

  return (
    <input type={'number'} placeholder={placeholderText} defaultValue={level.toString()} min={0} max={5000} onChange={(e: ChangeEvent) => updateState(e, buildingID)}/>
  );
};

export default Level;
