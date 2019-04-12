import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setMineCount, setMines, setTechedMiningRate } from '../../actions/Mines';
import { IMineState } from '../../types/mines';
import { getMineAmountSum, getHourlyMineIncome, mineOrder, getMineByID } from '../helperFunctions';
import { Mine } from './Mine';
import { IMarketPriceState } from '../../types/marketPrices';
import { Table } from 'rbx';
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
    <Table fullwidth narrow striped bordered hoverable>
      <Table.Head>
        <Table.Row>
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
            <Table.Heading key={index}>
              <abbr title={text}>{text}</abbr>
            </Table.Heading>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {mineOrder.map(mineID => {
          const mine = getMineByID(mines, mineID);

          return <Mine {...{ mines, mine, marketPrices, setMineCount, setTechedMiningRate, key: mineID }} />;
        })}
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell />
          <Table.Cell />
          <Table.Cell>{getMineAmountSum(mines)}</Table.Cell>
          <Table.Cell>{getHourlyMineIncome(mines, marketPrices)}</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
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
