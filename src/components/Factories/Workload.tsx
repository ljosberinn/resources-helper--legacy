import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';

interface IWorkload {
  factory: IFactory;
  mines: IMineState[];
}

const calcWorkload = (factory: IFactory, mines: IMineState[]) =>
  mines
    .map(mine => {
      const index = factory.requirements.findIndex(requirement => requirement.id === mine.resourceID);

      if (index === -1) {
        return 0;
      }

      const { currentAmount } = factory.requirements[index];

      return (mine.sumTechRate / currentAmount) * 100;
    })
    .reduce((lowestValue, nextValue) => (nextValue < lowestValue ? (lowestValue = nextValue) : lowestValue), Infinity);

export const Workload = ({ factory, mines }: IWorkload) => {
  const workload = calcWorkload(factory, mines);

  return <Fragment>{workload === Infinity ? 0 : workload.toFixed(2)}%</Fragment>;
};
