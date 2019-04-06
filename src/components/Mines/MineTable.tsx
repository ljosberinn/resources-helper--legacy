import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setMineCount, setMines, setTechedMiningRate } from '../../actions/Mines';
import { IMineState } from '../../types/mines';
import { getMineAmountSum, getHourlyMineIncome } from '../helperFunctions';
import { Mine } from './Mine';
import { IMarketPriceState } from '../../types/marketPrices';

interface PropsFromState {
  mines: IMineState[];
  marketPrices: IMarketPriceState;
}

interface PropsFromDispatch {
  setMineCount: typeof setMineCount;
  setMines: typeof setMines;
  setTechedMiningRate: typeof setTechedMiningRate;
}

type MineTableType = PropsFromState & PropsFromDispatch;

const ConnectedMineTable = memo((props: MineTableType) => {
  const { setMineCount, setTechedMiningRate, mines, marketPrices } = props;

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {mines.map(mine => (
          <Mine {...{ mine, marketPrices, setMineCount, setTechedMiningRate, key: mine.resourceID }} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>{getMineAmountSum(mines)}</td>
          <td>{getHourlyMineIncome(mines, marketPrices)}</td>
        </tr>
      </tfoot>
    </table>
  );
});

const mapStateToProps = ({ mines, marketPrices }: MineTableType) => ({ mines, marketPrices });

const mapDispatchToProps = {
  setMineCount,
  setMines,
  setTechedMiningRate,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const MineTable = preconnect(ConnectedMineTable);
MineTable.displayName = 'MineTable';
//@ts-ignore
MineTable.whyDidYouRender = true;
