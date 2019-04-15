import { Column } from 'rbx';
import React, { memo, MouseEvent, useState } from 'react';
import { IMineState } from '../../types/mines';
import { MineTypeDropdown } from './MineTypeDropdown';
import { QualityDropdown } from './QualityDropdown';
import { IMarketPriceState } from '../../types/marketPrices';
import { HQPlannerObj, ReduceResourcesParams } from '.';

interface CellProps {
  id: number;
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
  reduceResources: ({ hqPlannerObj, resources, setResources }: ReduceResourcesParams) => void;
  setResources: React.Dispatch<React.SetStateAction<HQPlannerObj[]>>;
  resources: HQPlannerObj[];
}

export const Cell = memo(({ id, marketPrices, mines, reduceResources, setResources, resources }: CellProps) => {
  const [hasMineTypeDropdownActive, setMineTypeDropdownActive] = useState(false);
  const [hasQualityDropdownActive, setQualityDropdownActive] = useState(false);

  const [resourceID, setResourceID] = useState<null | number>(null);
  const [maxHourlyRate, setMaxHourlyRate] = useState<null | number>(null);
  const [quality, setQuality] = useState<number>(1);

  const handleOnClick = () => {
    // reset in case someone clicked outside of a select
    if (hasMineTypeDropdownActive) {
      setMineTypeDropdownActive(false);
    }

    if (hasQualityDropdownActive) {
      setQualityDropdownActive(false);
    }

    setMineTypeDropdownActive(true);
  };

  const handleMineDropdownClick = (e: MouseEvent<Element>, resourceID: number) => {
    e.stopPropagation();

    setResourceID(resourceID);
    setMaxHourlyRate((mines.find(mine => mine.resourceID === resourceID) as IMineState).maxHourlyRate);

    setMineTypeDropdownActive(false);
    setQualityDropdownActive(true);
  };

  const handleQualityDropdownClick = (e: MouseEvent<Element>, quality: number) => {
    e.stopPropagation();

    setQuality(quality);
    const { ai, player } = marketPrices.find(price => price.id === resourceID) as IMarketPriceState;

    reduceResources({
      hqPlannerObj: {
        id,
        resourceID: resourceID as number,
        quality,
        worth: Math.round((maxHourlyRate as number) * quality * (player > 0 ? player : ai)),
      },
      resources,
      setResources,
    });

    setQualityDropdownActive(false);
  };

  return (
    <Column
      className={`hq-planner-cell ${resourceID !== null ? `mine-${resourceID}` : ''}`}
      onClick={handleOnClick}
      style={quality < 1 ? { '--opacity': quality } : {}}
    >
      {hasMineTypeDropdownActive && <MineTypeDropdown mines={mines} handleOnClick={handleMineDropdownClick} />}
      {hasQualityDropdownActive && <QualityDropdown handleOnClick={handleQualityDropdownClick} />}
    </Column>
  );
});

Cell.displayName = 'Cell';
//@ts-ignore
Cell.whyDidYouRender = true;
