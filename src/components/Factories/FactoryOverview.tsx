import React, { memo } from 'react';
import { Level } from './Level';
import { DetailsToggler } from './DetailsToggler';
import { IFactory } from '../../types/factory';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';

export interface FactoryProps {
  factory: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

const calcWorkload = (factory: IFactory) =>
  Math.min(
    ...factory.requirements
      .filter(requirement => requirement.id !== 1)
      .map(requirement => requirement.currentGivenAmount / requirement.currentRequiredAmount),
  );

const calcScaling = (level: number, scaling: number) => scaling * (Number.isNaN(level) ? 0 : level);

export const FactoryOverview = memo(
  ({ factory, setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel }: FactoryProps) => {
    const { id, level, requirements, scaling } = factory;

    const workload = calcWorkload(factory);
    const producedQuantity = calcScaling(level, scaling);

    return (
      <tr>
        <td>ID {id}</td>
        <td>
          <Level
            {...{
              id,
              level,
              requirements,
              setLevel,
              adjustRequirementsToLevel,
            }}
          />
        </td>
        <td>{producedQuantity.toLocaleString()}</td>
        <td>
          {Object.values(requirements).map(dependency => (
            <span key={dependency.id}>
              <i className={`icon-${dependency.id}`} /> {dependency.currentRequiredAmount.toLocaleString()} <br />
            </span>
          ))}
        </td>
        <td>{(workload * 100).toFixed(2).toString()}%</td>
        <td>{workload}</td>
        <td>Turnover Increase per Upgrade</td>
        <td>Upgrade Cost</td>
        <td>GD Order Indicator</td>
        <td>
          <DetailsToggler {...{ id, toggleFactoryDetailsVisibility }} />
        </td>
      </tr>
    );
  },
);

FactoryOverview.displayName = 'FactoryOverview';
//@ts-ignore
FactoryOverview.whyDidYouRender = true;
