import { Input, Table } from 'rbx';
import React, { ChangeEvent, useMemo, useState, useCallback } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { connect } from 'react-redux';
import { store } from '../..';
import {
  adjustProductionRequirementsToGivenAmount,
  adjustProductionRequirementsToLevel,
  setFactories,
  setLevel,
  setWorkload,
  toggleFactoryDetailsVisibility,
} from '../../actions/Factories';
import { setPrices } from '../../actions/MarketPrices';
import { setMines } from '../../actions/Mines';
import { FACTORY_CALCULATION_ORDER } from '../../constants';
import {
  evaluateLoadingAnimationTimeout,
  getElapsedLoadingTime,
  getFactoryByID,
  getPricesByID,
  getStaticData,
  handleFocus,
} from '../../helperFunctions';
import { IPreloadedState } from '../../types';
import { FactoryIDs, FactoryScalings, IFactory, IFactoryProductionRequirements, ProductIDs } from '../../types/factory';
import { IMarketPriceState } from '../../types/marketPrices';
import { IMineState, ResourceIDs } from '../../types/mines';
import { useAsyncEffect } from '../Hooks';
import { Loading } from '../Shared/Loading';

interface PropsFromState {
  hasError?: boolean;
  errorType?: string;
  factories: IFactory[];
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
}

interface PropsFromDispatch {
  setFactories: typeof setFactories;
  setPrices: typeof setPrices;
  setMines: typeof setMines;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  setLevel: typeof setLevel;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
  adjustProductionRequirementsToGivenAmount: typeof adjustProductionRequirementsToGivenAmount;
  setWorkload: typeof setWorkload;
}

type FactoriesProps = PropsFromState & PropsFromDispatch;

const ConnectedFactory = (props: FactoriesProps) => {
  const { marketPrices, factories, mines } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(marketPrices.length === 0 || factories.length === 0 || mines.length === 0);

  useAsyncEffect(async () => {
    if (!hasError && isLoading) {
      const loadingStart = new Date().getTime();

      const prices = (await getStaticData('marketPrices', setError, setErrorType)) as IMarketPriceState[];
      const factories = (await getStaticData('factories', setError, setErrorType)) as IFactory[];
      const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];

      setTimeout(() => {
        props.setPrices(prices);
        props.setFactories(factories);
        props.setMines(mines);
        setIsLoading(false);
      }, evaluateLoadingAnimationTimeout(getElapsedLoadingTime(loadingStart)));
    }
  }, []);

  if (hasError) {
    if (errorType === 'AbortError') {
      return <p>Server unavailable</p>;
    }

    return <p>Error</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  const handleDetailsOnClick = useCallback((factoryID: FactoryIDs) => props.toggleFactoryDetailsVisibility(factoryID), []);

  const handleLevelChange = useCallback((e: ChangeEvent<HTMLInputElement>, factory: IFactory) => {
    const { level, productionRequirements, scaling, dependantFactories, id, productID } = factory;

    const newLevel = parseInt(e.target.value);

    if (Number.isNaN(newLevel) || level === newLevel) {
      return;
    }

    const newWorkload = getWorkload(factory);
    const newGivenAmount = Math.round(scaling * newLevel * (newWorkload > 1 ? 1 : newWorkload));

    dependantFactories.forEach(dependantFactoryID => {
      props.adjustProductionRequirementsToGivenAmount(dependantFactoryID, productID, newGivenAmount);
    });

    props.setWorkload(id, newWorkload);
    props.setLevel(newLevel, id);
    props.adjustProductionRequirementsToLevel(id, scaleRequirements(productionRequirements, newLevel));

    recursiveFactoryWorkloadRecalculation(factories, dependantFactories, props.setWorkload);
  }, []);

  const Thead = useMemo(
    () => (
      <thead>
        <tr>
          {[
            'factoryID',
            'factoryLevel',
            'production/h',
            'dependencies',
            'workload',
            'profit/h',
            'profit increase/upgrade',
            'productionCost/hr',
            'upgradeCost',
            'GD Order Indicator',
            '',
          ].map((text, index) => (
            <th key={index}>
              <abbr title={text}>{text}</abbr>
            </th>
          ))}
        </tr>
      </thead>
    ),
    [],
  );

  const Tbody = FACTORY_CALCULATION_ORDER.map(factoryID => {
    const factory = getFactoryByID(factories, factoryID);

    const { workload, level, productID, productionRequirements, scaling, hasDetailsVisible } = factory;

    const price = getPricesByID(marketPrices, productID);
    const currentPrice = price.player > 0 ? price.player : price.ai;

    const producedQuantity = getProducedQuantity(level, scaling);
    const turnoverPerHour = getTurnoverPerHour(workload, producedQuantity, currentPrice);

    return useMemo(
      () => (
        <tbody key={factoryID}>
          <tr>
            <td>ID {factoryID}</td>
            <td>
              <Input
                as={DebounceInput}
                type="number"
                placeholder="PH"
                value={level}
                min="0"
                max="5000"
                onFocus={handleFocus}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleLevelChange(e, factory)}
                debounceTimeout={300}
                size={'small'}
                className="has-text-right"
              />
            </td>
            <td className="has-text-right">
              <span>
                {producedQuantity.toLocaleString()}
                <i className={`icon-${productID}`} />
              </span>
            </td>
            <td className="has-text-right">{getProductionRequirements(productionRequirements)}</td>
            <td className="has-text-right">{(workload * 100).toFixed(2).toString()}%</td>
            <td className="has-text-right" title={currentPrice.toLocaleString()}>
              {turnoverPerHour}
            </td>
            <td>
              <button type="button" onClick={() => handleDetailsOnClick(factoryID)}>
                Detail
              </button>
            </td>
          </tr>
          <tr hidden={!hasDetailsVisible}>
            <td>ROI</td>
            <td>GD Information</td>
            <td>Total Materials built with</td>
          </tr>
        </tbody>
      ),
      [factory],
    );
  });

  return (
    <Table hoverable narrow striped fullwidth bordered>
      {Thead}
      {Tbody}
    </Table>
  );
};

const getTurnoverPerHour = (workload: number, producedQuantity: number, price: number) =>
  Math.round((workload > 1 ? 1 : workload) * producedQuantity * price).toLocaleString();

const getProducedQuantity = (level: number, scaling: FactoryScalings) => scaling * (Number.isNaN(level) ? 0 : level);

const getProductionRequirements = (productionRequirements: IFactoryProductionRequirements[]) =>
  Object.values(
    productionRequirements.map(requirement => <p key={requirement.id}>{requirement.currentRequiredAmount.toLocaleString()}</p>),
  );

const scaleRequirements = (requirements: IFactoryProductionRequirements[], level: number) =>
  requirements.map(requirement => ({
    ...requirement,
    currentRequiredAmount: requirement.amountPerLevel * level,
  }));

const isFactoryRequirement = (requirementID: ResourceIDs | ProductIDs | 1) =>
  [7, 22, 24, 28, 30, 32, 35, 36, 38, 51, 60, 58, 67, 66, 75, 79, 84, 93, 92, 87, 117, 124].includes(requirementID);

const getFactoryByProductID = (factories: IFactory[], productID: ResourceIDs | ProductIDs | 1) =>
  factories.find(factory => factory.productID === productID);

const getWorkload = (factory: IFactory) => {
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

const recursiveFactoryWorkloadRecalculation = (
  factories: IFactory[],
  dependantFactories: FactoryIDs[],
  workloadSetter: typeof setWorkload,
) => {
  const cascadedFactoryIDs: FactoryIDs[] = [];

  dependantFactories.forEach(factoryID => {
    const dependantFactory = getFactoryByID(factories, factoryID);
    const { workload } = dependantFactory;
    const newWorkload = getWorkload(dependantFactory);

    if (workload !== newWorkload) {
      workloadSetter(factoryID, newWorkload);
    }

    // proxy cascading to prevent duplicate re-calculation & -rendering for cross-dependencies (looking at you,)
    dependantFactory.dependantFactories.forEach(dependantFactoryID => {
      if (cascadedFactoryIDs.indexOf(dependantFactoryID) === -1) {
        cascadedFactoryIDs.push(dependantFactoryID);
      }
    });
  });

  if (cascadedFactoryIDs.length > 0) {
    recursiveFactoryWorkloadRecalculation(factories, cascadedFactoryIDs, workloadSetter);
  }
};

const mapStateToProps = (state: IPreloadedState) => ({
  factories: state.factories,
  marketPrices: state.marketPrices,
  mines: state.mines,
});

const mapDispatchToProps = {
  setFactories,
  setPrices,
  setMines,
  toggleFactoryDetailsVisibility,
  setLevel,
  adjustProductionRequirementsToLevel,
  adjustProductionRequirementsToGivenAmount,
  setWorkload,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const Factories = preconnect(ConnectedFactory);
export default Factories;
ConnectedFactory.displayName = 'ConnectedFactory';
//@ts-ignore
ConnectedFactory.whyDidYouRender = true;
