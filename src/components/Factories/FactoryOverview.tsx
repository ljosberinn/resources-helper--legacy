import React, { memo } from 'react';
import { FactoryProps } from '../../types/factory';
import { ProductionDependencies } from './ProductionDependencies';
import { Level } from './Level';
import { Scaling } from './Scaling';
import { DetailsToggler } from './DetailsToggler';

export const FactoryOverview = memo(({ data, setLevel, toggleFactoryDetailsVisibility }: FactoryProps) => {
  const { id, level, scaling } = data;

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
        <ProductionDependencies {...data} />
      </td>
      <td>Workload</td>
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
