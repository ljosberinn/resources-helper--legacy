import React, { ChangeEvent, memo } from 'react';
import { IMineState, MaxMineRates, MinePrices } from '../../types/mines';
import { setTechedMiningRate, setMineCount } from '../../actions/Mines';
import { IMarketPriceState } from '../../types/marketPrices';
import { getPricesByID } from '../helperFunctions';
import { DebounceInput } from 'react-debounce-input';

interface MineProps {
  mines: IMineState[];
  mine: IMineState;
  marketPrices: IMarketPriceState[];
  setTechedMiningRate: typeof setTechedMiningRate;
  setMineCount: typeof setMineCount;
}

const getMineIncomePerHour = ({ ai, player }: IMarketPriceState, { sumTechRate }: IMineState) => {
  return sumTechRate * (player > 0 ? player : ai);
};

const getPerfectIncome = (maxHourlyRate: MaxMineRates, { ai, player }: IMarketPriceState) =>
  (player > 0 ? player : ai) * maxHourlyRate;

const getMineROI = (nextMinePrice: number, perfectIncome: number, factor = 1) =>
  (nextMinePrice / perfectIncome / 24 / factor).toFixed(2).toLocaleString();

const getNextMinePrice = (mines: IMineState[], basePrice: MinePrices) =>
  Math.round((1 + mines.reduce((sum, mine) => sum + mine.amount, 0) / 50) * basePrice);

export const Mine = memo(({ mines, mine, marketPrices, setTechedMiningRate, setMineCount }: MineProps) => {
  const { resourceID, sumTechRate, maxHourlyRate, amount, basePrice } = mine;

  const updateTechedMiningRate = (e: ChangeEvent<HTMLInputElement>) => {
    const miningRate = parseInt(e.target.value);

    setTechedMiningRate(mine.resourceID, Number.isNaN(miningRate) ? 0 : miningRate);
  };

  const updateMineCount = (e: ChangeEvent<HTMLInputElement>) => {
    const mineCount = parseInt(e.target.value);

    setMineCount(resourceID, Number.isNaN(mineCount) ? 0 : mineCount);
  };

  const price = getPricesByID(marketPrices, resourceID);

  const nextMinePrice = getNextMinePrice(mines, basePrice);
  const perfectIncome = getPerfectIncome(maxHourlyRate, price);

  return (
    <tr>
      <td>ID {resourceID}</td>
      <td>
        <DebounceInput
          type="number"
          min="0"
          max="200000000"
          onChange={updateTechedMiningRate}
          value={sumTechRate.toString()}
          placeholder="rate/hr"
          debounceTimeout={300}
        />
      </td>
      <td>
        <DebounceInput
          type="number"
          min="0"
          max="35000"
          onChange={updateMineCount}
          value={amount.toString()}
          placeholder="mine amount"
          debounceTimeout={300}
        />
      </td>
      <td>{getMineIncomePerHour(price, mine).toLocaleString()}</td>
      <td>{nextMinePrice.toLocaleString()}</td>
      <td>{perfectIncome.toLocaleString()}</td>
      <td>{getMineROI(nextMinePrice, perfectIncome)}</td>
      <td>{getMineROI(nextMinePrice, perfectIncome, 5.05)}</td>
      <td>{getMineROI(nextMinePrice, perfectIncome, 5.05 * 10)}</td>
    </tr>
  );
});

Mine.displayName = 'Mine';
//@ts-ignore
Mine.whyDidYouRender = true;
