import React, { memo } from 'react';
import { Level } from './Level';
import { DetailsToggler } from './DetailsToggler';
import { IFactory, IFactoryProductionRequirements, FactoryScalings } from '../../types/factory';
import { setLevel, toggleFactoryDetailsVisibility, adjustProductionRequirementsToLevel } from '../../actions/Factories';
import { IMarketPriceState } from '../../types/marketPrices';
import { getPricesByID } from '../helperFunctions';

export interface FactoryProps {
  factory: IFactory;
  setLevel: typeof setLevel;
  marketPrices: IMarketPriceState[];
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
}

const getWorkload = (factory: IFactory) => {
  const minWorkload = Math.min(
    ...factory.productionRequirements
      .filter(requirement => requirement.id !== 1)
      .map(requirement => requirement.currentGivenAmount / requirement.currentRequiredAmount),
  );

  return Number.isNaN(minWorkload) ? 0.0 : minWorkload;
};

const getScaling = (level: number, scaling: FactoryScalings) => scaling * (Number.isNaN(level) ? 0 : level);

const getTurnoverPerHour = (workload: number, producedQuantity: number, price: number) =>
  Math.round((workload > 1 ? 1 : workload) * producedQuantity * price).toLocaleString();

const getTurnoverPerUpgrade = (scaling: FactoryScalings, price: number) => (scaling * price).toLocaleString();

const getRequirementCostPerHour = (
  productionRequirements: IFactoryProductionRequirements[],
  marketPrices: IMarketPriceState[],
) =>
  Math.round(
    productionRequirements.reduce((sum, requirement) => {
      /* cash requirement*/
      if (requirement.id === 1) {
        return sum + requirement.currentRequiredAmount;
      }
      const { ai, player } = getPricesByID(marketPrices, requirement.id);
      // material requirement
      return sum + requirement.currentRequiredAmount * (player > 0 ? player : ai);
    }, 0),
  ).toLocaleString();

export const FactoryOverview = memo(
  ({
    marketPrices,
    factory,
    setLevel,
    toggleFactoryDetailsVisibility,
    adjustProductionRequirementsToLevel,
  }: FactoryProps) => {
    const { id, level, productionRequirements, scaling } = factory;

    const price = getPricesByID(marketPrices, factory.productID);

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
              productionRequirements,
              setLevel,
              adjustProductionRequirementsToLevel,
            }}
          />
        </td>
        <td>{producedQuantity.toLocaleString()}</td>
        <td>
          {Object.values(productionRequirements).map(requirement => (
            <span key={requirement.id}>
              <i className={`icon-${requirement.id}`} /> {requirement.currentRequiredAmount.toLocaleString()} <br />
            </span>
          ))}
        </td>
        <td>{(workload * 100).toFixed(2).toString()}%</td>
        <td title={price.player > 0 ? price.player.toLocaleString() : price.ai.toLocaleString()}>{turnoverPerHour}</td>
        <td>{getTurnoverPerUpgrade(scaling, currentPrice)}</td>
        <td>{getRequirementCostPerHour(productionRequirements, marketPrices)}</td>
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
