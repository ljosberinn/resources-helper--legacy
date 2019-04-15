import React, { memo } from 'react';
import { Level } from './Level';
import { DetailsToggler } from './DetailsToggler';
import { IFactory, IFactoryProductionRequirements, FactoryScalings, ProductIDs } from '../../types/factory';
import { ResourceIDs } from '../../types/mines';
import {
  setLevel,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
  setWorkload,
  adjustProductionRequirementsToGivenAmount,
} from '../../actions/Factories';
import { IMarketPriceState } from '../../types/marketPrices';
import { getPricesByID } from '../helperFunctions';
import { store } from '../..';
import { ProducedQuantity } from './ProducedQuantity';
import { Workload } from './Workload';

export interface FactoryProps {
  factory: IFactory;
  factories: IFactory[];
  setLevel: typeof setLevel;
  marketPrices: IMarketPriceState[];
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
  adjustProductionRequirementsToGivenAmount: typeof adjustProductionRequirementsToGivenAmount;
  setWorkload: typeof setWorkload;
}

const isFactoryRequirement = (requirementID: ResourceIDs | ProductIDs | 1) =>
  [7, 22, 24, 28, 30, 32, 35, 36, 38, 51, 60, 58, 67, 66, 75, 79, 84, 93, 92, 87, 117, 124].includes(requirementID);

const getFactoryByProductID = (factories: IFactory[], productID: ResourceIDs | ProductIDs | 1) =>
  factories.find(factory => factory.productID === productID);

export const getWorkload = (factory: IFactory) => {
  const minWorkload = Math.min(
    ...factory.productionRequirements
      .filter(requirement => requirement.id !== 1)
      .map(requirement => {
        if (!isFactoryRequirement(requirement.id)) {
          return requirement.currentGivenAmount / requirement.currentRequiredAmount;
        }

        const { workload } = getFactoryByProductID(store.getState().factories, requirement.id) as IFactory;

        if (workload === 0) {
          return 0;
        }

        if (workload >= 1) {
          return requirement.currentGivenAmount / requirement.currentRequiredAmount;
        }

        return (requirement.currentGivenAmount * workload) / requirement.currentRequiredAmount;
      }),
  );

  return Number.isNaN(minWorkload) || minWorkload === Infinity ? 0.0 : minWorkload;
};

const getScaling = (level: number, scaling: FactoryScalings) => scaling * (Number.isNaN(level) ? 0 : level);

const getTurnoverPerHour = (workload: number, producedQuantity: number, price: number) =>
  Math.round((workload > 1 ? 1 : workload) * producedQuantity * price).toLocaleString();

const getProfitIncreasePerUpgrade = (scaling: FactoryScalings, price: number) => (scaling * price).toLocaleString();

const getRequirementCostPerHour = (productionRequirements: IFactoryProductionRequirements[], marketPrices: IMarketPriceState[]) =>
  Math.round(
    productionRequirements.reduce((sum, requirement) => {
      // cash requirement
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
    factories,
    marketPrices,
    factory,
    setLevel,
    toggleFactoryDetailsVisibility,
    adjustProductionRequirementsToLevel,
    adjustProductionRequirementsToGivenAmount,
    setWorkload,
  }: FactoryProps) => {
    const { id, level, productionRequirements, scaling, dependantFactories, workload } = factory;

    const price = getPricesByID(marketPrices, factory.productID);
    const currentPrice = price.player > 0 ? price.player : price.ai;

    const currentWorkload = getWorkload(factory);
    if (currentWorkload !== workload) {
      setWorkload(id, currentWorkload);
    }

    const producedQuantity = getScaling(level, scaling);
    const turnoverPerHour = getTurnoverPerHour(workload, producedQuantity, currentPrice);

    return (
      <tr>
        <td>ID {id}</td>
        <td>
          <Level
            {...{
              factories,
              id,
              level,
              productionRequirements,
              dependantFactories,
              setLevel,
              adjustProductionRequirementsToLevel,
              adjustProductionRequirementsToGivenAmount,
              getWorkload,
              setWorkload,
            }}
          />
        </td>
        <ProducedQuantity {...{ producedQuantity, productID: factory.productID }} />
        <td className="has-text-right">
          {Object.values(productionRequirements).map(requirement => (
            <span key={requirement.id}>
              {requirement.currentRequiredAmount.toLocaleString()} <i className={`icon-${requirement.id}`} />
            </span>
          ))}
        </td>
        <Workload {...{ workload }} />
        <td className="has-text-right" title={currentPrice.toLocaleString()}>
          {turnoverPerHour}
        </td>
        <td className="has-text-right">{getProfitIncreasePerUpgrade(scaling, currentPrice)}</td>
        <td className="has-text-right">{getRequirementCostPerHour(productionRequirements, marketPrices)}</td>
        <td className="has-text-right">{0}</td>
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
