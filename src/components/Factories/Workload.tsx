import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';

interface IWorkload {
  factory: IFactory;
  mines: IMineState[];
}

const calcWorkload = 0;

export const Workload = ({ factory, mines }: IWorkload) => {
  console.log(factory, mines);
  return <Fragment>{calcWorkload}</Fragment>;
};
