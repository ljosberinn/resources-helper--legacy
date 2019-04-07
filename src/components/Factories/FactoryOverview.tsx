import React, { memo } from 'react';
import { Level } from './Level';
import { DetailsToggler } from './DetailsToggler';
import { IFactory, IFactoryRequirements } from '../../types/factory';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';
import { IMarketPriceState } from '../../types/marketPrices';

export interface FactoryProps {
  factory: IFactory;
  setLevel: typeof setLevel;
  marketPrices: IMarketPriceState;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

const getWorkload = (factory: IFactory) =>
  Math.min(
    ...factory.requirements
      .filter(requirement => requirement.id !== 1)
      .map(requirement => requirement.currentGivenAmount / requirement.currentRequiredAmount),
  );

const getScaling = (level: number, scaling: number) => scaling * (Number.isNaN(level) ? 0 : level);

const getTurnoverPerHour = (workload: number, producedQuantity: number, price: number) =>
  Math.round((workload > 1 ? 1 : workload) * producedQuantity * price).toLocaleString();

const getTurnoverPerUpgrade = (scaling: number, price: number) => (scaling * price).toLocaleString();

const getRequirementCostPerHour = (requirements: IFactoryRequirements[], marketPrices: IMarketPriceState) =>
  Math.round(
    requirements.reduce(
      (sum, requirement) =>
        // cash requirement
        requirement.id === 1
          ? sum + requirement.currentRequiredAmount
          : // material requirement
            sum +
            requirement.currentRequiredAmount *
              (marketPrices[requirement.id].player > 0
                ? marketPrices[requirement.id].player
                : marketPrices[requirement.id].ai),
      0,
    ),
  ).toLocaleString();

export const FactoryOverview = memo(
  ({ marketPrices, factory, setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel }: FactoryProps) => {
    const { id, level, requirements, scaling } = factory;

    const price = marketPrices[factory.productID];

    const currentPrice = price.player > 0 ? price.player : price.ai;

    const workload = getWorkload(factory);
    const producedQuantity = getScaling(level, scaling);
    const turnoverPerHour = getTurnoverPerHour(workload, producedQuantity, currentPrice);

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
          {Object.values(requirements).map(requirement => (
            <span key={requirement.id}>
              <i className={`icon-${requirement.id}`} /> {requirement.currentRequiredAmount.toLocaleString()} <br />
            </span>
          ))}
        </td>
        <td>{(workload * 100).toFixed(2).toString()}%</td>
        <td title={price.player > 0 ? price.player.toLocaleString() : price.ai.toLocaleString()}>{turnoverPerHour}</td>
        <td>{getTurnoverPerUpgrade(scaling, currentPrice)}</td>
        <td>{getRequirementCostPerHour(requirements, marketPrices)}</td>
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
