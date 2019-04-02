import React, { memo } from 'react';
import { Requirements } from './Requirements';
import { Level } from './Level';
import { Scaling } from './Scaling';
import { DetailsToggler } from './DetailsToggler';
import { Workload } from './Workload';
import { IFactory } from '../../types/factory';
import { IMineState } from '../../types/mines';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';

export interface FactoryProps {
  factory: IFactory;
  mines: IMineState[];
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

export const FactoryOverview = memo(
  ({ factory, mines, setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel }: FactoryProps) => {
    const { id, level, requirements, scaling } = factory;

    return (
      <tr>
        <td>ID {id}</td>
        <td>
          <Level id={id} level={level} requirements={requirements} setLevel={setLevel} adjustRequirementsToLevel={adjustRequirementsToLevel} />
        </td>
        <td>
          <Scaling id={id} scaling={scaling} level={level} />
        </td>
        <td>
          <Requirements {...factory} />
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
  },
);

FactoryOverview.displayName = 'FactoryOverview';
