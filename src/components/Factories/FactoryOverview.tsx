import React, { memo } from 'react';
import { ProductionDependencies } from './ProductionDependencies';
import { Level } from './Level';
import { Scaling } from './Scaling';
import { DetailsToggler } from './DetailsToggler';
import { Workload } from './Workload';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';
import { setLevel, toggleFactoryDetailsVisibility } from '../../actions/Factories';

export interface FactoryProps {
  factory: IFactory;
  mines: IMineState[];
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

export const FactoryOverview = memo(({ factory, mines, setLevel, toggleFactoryDetailsVisibility }: FactoryProps) => {
  const { id, level, scaling } = factory;
  console.log(mines);

  return (
    <tr>
      <td>ID {id}</td>
      <td>
        <Level id={id} level={level} setLevel={setLevel} />
      </td>
      <td>
        <Scaling id={id} scaling={scaling} level={level} />
      </td>
      <td>
        <ProductionDependencies {...factory} />
      </td>
      <td>
        <Workload factory={factory} mines={mines} />
      </td>
      <td>Turnover</td>
      <td>Turnover Increase per Upgrade</td>
      <td>Upgrade Cost</td>
      <td>GD Order Indicator</td>
      <td>
        <DetailsToggler id={id} toggleFactoryDetailsVisibility={toggleFactoryDetailsVisibility} />
      </td>
    </tr>
  );
});
