import { Box, Field, Column, Control, Input, Label } from 'rbx';
import React, { useState, ChangeEvent, Fragment } from 'react';
import { store } from '../..';
import { Cell } from './Cell';
import { useAsyncEffect } from '../Hooks';
import { getStaticData, evaluateLoadingAnimationTimeout, getElapsedLoadingTime } from '../../helperFunctions';
import { IMarketPriceState } from '../../types/marketPrices';
import { IMineState } from '../../types/mines';
import { Loading } from '../Shared/Loading';
import { IPreloadedState } from '../../types';
import { setPrices } from '../../actions/MarketPrices';
import { setMines } from '../../actions/Mines';
import { connect } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import { handleFocus } from '../../helperFunctions';
import './index.scss';

interface PropsFromState {
  hasError?: boolean;
  errorType?: string;
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
}

interface PropsFromDispatch {
  setPrices: typeof setPrices;
  setMines: typeof setMines;
}

export interface HQPlannerObj {
  id: number;
  resourceID: number;
  quality: number;
  worth: number;
}

type HQPlannerProps = PropsFromState & PropsFromDispatch;

const getHQLevelBoostFactor = (hqLevel: number) => 1 + hqLevel * 0.9;

const getResourcesIncome = (resources: HQPlannerObj[], hqLevel: number) =>
  Math.round(resources.reduce((sum, resource) => sum + resource.worth, 0) * getHQLevelBoostFactor(hqLevel) * 5.05);

const getAverageResourceQuality = (resources: HQPlannerObj[]) => {
  const average = resources.reduce((sum, resource) => sum + resource.quality, 0) / resources.length;

  return Number.isNaN(average) ? 0 : average * 100;
};

export interface ReduceResourcesParams {
  hqPlannerObj: HQPlannerObj;
  resources: HQPlannerObj[];
  setResources: React.Dispatch<React.SetStateAction<HQPlannerObj[]>>;
}

const reduceResources = ({ hqPlannerObj, resources, setResources }: ReduceResourcesParams) => {
  const { id, resourceID, quality, worth } = hqPlannerObj;

  if (resources.find(resource => resource.id === id)) {
    setResources(
      resources.map(dataset => {
        if (dataset.id !== id) {
          return dataset;
        }

        return {
          ...dataset,
          resourceID,
          quality,
          worth,
        };
      }),
    );
    return;
  }

  setResources([...resources, { id, resourceID, quality, worth }]);
};

export const ConnectedHQPlanner = (props: HQPlannerProps) => {
  const { marketPrices, mines } = store.getState();

  const [hasError, setError] = useState(false);
  const [errorType, setErrorType] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(mines.length === 0 || marketPrices.length === 0);
  const [gridSize, setGridSize] = useState(17);
  const [hqLevel, setHQLevel] = useState(1);
  const [resources, setResources] = useState<HQPlannerObj[]>([]);

  useAsyncEffect(async () => {
    if (!hasError && isLoading) {
      const loadingStart = new Date().getTime();

      const prices = (await getStaticData('marketPrices', setError, setErrorType)) as IMarketPriceState[];
      const mines = (await getStaticData('mines', setError, setErrorType)) as IMineState[];

      setTimeout(() => {
        props.setPrices(prices);
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

  const handleHQLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHQLevel = parseInt(e.target.value);

    if (newHQLevel === hqLevel || Number.isNaN(newHQLevel)) {
      return;
    }

    setHQLevel(newHQLevel);
  };

  const handleGridSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newGridSize = parseInt(e.target.value);
    if (newGridSize === gridSize || Number.isNaN(newGridSize)) {
      return;
    }

    setGridSize(newGridSize);
  };

  if (isLoading) {
    return <Loading />;
  }

  const grid = [...Array(gridSize)];

  return (
    <Fragment>
      <Field>
        <Label>Change Grid Size</Label>
        <Control>
          <Input
            as={DebounceInput}
            placeholder="grid size, 17 default (289 mines)"
            type="number"
            min="0"
            max="50"
            onChange={handleGridSizeChange}
            onFocus={handleFocus}
            debounceTimeout={300}
            value={gridSize}
            size="small"
            className="has-text-right"
          />
        </Control>
      </Field>
      <Field>
        <Label>Select HQ Level</Label>
        <Control>
          <Input
            as={DebounceInput}
            placeholder="HQ Level"
            type="number"
            min="1"
            max="10"
            onChange={handleHQLevelChange}
            onFocus={handleFocus}
            debounceTimeout={300}
            value={hqLevel}
            size="small"
            className="has-text-right"
          />
        </Control>
      </Field>
      <Box>
        {grid.map((_, row) => (
          <Column.Group className="hq-plan-grid" key={row}>
            {grid.map((_, item) => {
              const cellProps = {
                id: parseInt(`${row}${item}`),
                resources,
                marketPrices,
                mines,
                reduceResources,
                setResources,
              };

              return <Cell {...cellProps} key={item} />;
            })}
          </Column.Group>
        ))}
        <hr />
        <p>Mines built: {resources.length}</p>
        <p>Income sum: {getResourcesIncome(resources, hqLevel).toLocaleString()}</p>
        <p>Average quality: {getAverageResourceQuality(resources).toFixed(2)}%</p>
      </Box>
    </Fragment>
  );
};

const mapStateToProps = (state: IPreloadedState) => ({
  marketPrices: state.marketPrices,
  mines: state.mines,
});

const mapDispatchToProps = {
  setPrices,
  setMines,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const HQPlanner = preconnect(ConnectedHQPlanner);
ConnectedHQPlanner.displayName = 'ConnectedHQPlanner';
//@ts-ignore
ConnectedHQPlanner.whyDidYouRender = true;

export default HQPlanner;
