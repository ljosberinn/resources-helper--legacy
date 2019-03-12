import * as React                  from 'react';
import { FunctionComponent }       from 'react';
import { ChangeEvent }             from 'react';
import { LevelProps }              from './interfaces';
import { extractChangeEventValue } from './helper';
import { store }                   from '../../Store';
import { setFactoryLevel }         from '../../actions/Factories';

const updateState = (e: ChangeEvent, factoryID: number) => {
  const level = parseInt(extractChangeEventValue(e));

  store.dispatch(setFactoryLevel(level, factoryID));
};

const Level: FunctionComponent<LevelProps> = (props: LevelProps) => {

  const { level, placeholderText, factoryID } = props;

  return (
    <input type={'number'} placeholder={placeholderText} defaultValue={level.toString()} min={0} max={5000} onChange={(e: ChangeEvent) => updateState(e, factoryID)}/>
  );
};

export default Level;
