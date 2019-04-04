import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';

interface IWorkload {
  factory: IFactory;
  mines: IMineState[];
}

const calcWorkload = (factory: IFactory, mines: IMineState[]) =>
  Math.min(
    ...mines.map(mine => {
      const index = factory.requirements.findIndex(requirement => requirement.id === mine.resourceID);

      if (index === -1) {
        return 0;
      }

      const { currentAmount } = factory.requirements[index];

      return (mine.sumTechRate / currentAmount) * 100;
    }),
  ).toFixed(2);

export const Workload = ({ factory, mines }: IWorkload) => <Fragment>{calcWorkload(factory, mines)}%</Fragment>;
