import React, { ChangeEvent, memo } from 'react';
import { IMineState } from '../../types/mines';
import { setTechedMiningRate, setMineCount } from '../../actions/Mines';
import { IMarketPriceState } from '../../types/marketPrices';

interface MineProps {
  mine: IMineState;
  marketPrices: IMarketPriceState;
  setTechedMiningRate: typeof setTechedMiningRate;
  setMineCount: typeof setMineCount;
}

export const Mine = memo(({ mine, marketPrices, setTechedMiningRate, setMineCount }: MineProps) => {
  const updateTechedMiningRate = (e: ChangeEvent<HTMLInputElement>) => {
    const miningRate = parseInt(e.target.value);

    setTechedMiningRate(mine.resourceID, Number.isNaN(miningRate) ? 0 : miningRate);
  };

  const updateMineCount = (e: ChangeEvent<HTMLInputElement>) => {
    const mineCount = parseInt(e.target.value);

    setMineCount(mine.resourceID, Number.isNaN(mineCount) ? 0 : mineCount);
  };

  return (
    <tr>
      <td>ID {mine.resourceID}</td>
      <td>
        <input
          type="number"
          min="0"
          max="200000000"
          onChange={updateTechedMiningRate}
          defaultValue={mine.sumTechRate.toString()}
          placeholder="rate/hr"
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="35000"
          onChange={updateMineCount}
          defaultValue={mine.amount.toString()}
          placeholder="mine amount"
        />
      </td>
      <td>{(mine.sumTechRate * marketPrices[mine.resourceID].player).toLocaleString()}</td>
    </tr>
  );
});

Mine.displayName = 'Mine';
//@ts-ignore
Mine.whyDidYouRender = true;
