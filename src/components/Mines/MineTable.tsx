import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setMineCount, setMines, setTechedMiningRate } from '../../actions/Mines';
import { IMineState } from '../../types/mines';
import { getMineAmountSum, getHourlyMineIncome, mineOrder, getMineByID } from '../helperFunctions';
import { Mine } from './Mine';
import { IMarketPriceState } from '../../types/marketPrices';

interface PropsFromState {
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
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
        <tr>
          {[
            'Mine type',
            'Your rate per hour',
            'Your amount of mines',
            'Worth @ 100% condition',
            'Mine price',
            '100% quality income',
            'ROI 100%',
            '505%',
            '505% in your HQ',
          ].map((text, index) => (
            <th key={index}>{text}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mineOrder.map(mineID => {
          const mine = getMineByID(mines, mineID);

          return <Mine {...{ mines, mine, marketPrices, setMineCount, setTechedMiningRate, key: mineID }} />;
        })}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td />
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
