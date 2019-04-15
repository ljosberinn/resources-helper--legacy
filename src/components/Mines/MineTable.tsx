import React from 'react';
import { connect } from 'react-redux';
import { setMineCount, setMines, setTechedMiningRate } from '../../actions/Mines';
import { adjustProductionRequirementsToGivenAmount } from '../../actions/Factories';
import { IMineState } from '../../types/mines';
import { getMineAmountSum, getHourlyMineIncome, getMineByID } from '../../helperFunctions';
import { Mine } from './Mine';
import { IMarketPriceState } from '../../types/marketPrices';
import { MineHeading } from './MineHeading';
import { Table } from 'rbx';
import { MINE_ORDER } from '../../constants';
import { IFactory } from '../../types/factory';

interface PropsFromState {
  factories: IFactory[];
  mines: IMineState[];
  marketPrices: IMarketPriceState[];
}

interface PropsFromDispatch {
  setMineCount: typeof setMineCount;
  setMines: typeof setMines;
  setTechedMiningRate: typeof setTechedMiningRate;
  adjustProductionRequirementsToGivenAmount: typeof adjustProductionRequirementsToGivenAmount;
}

type MineTableType = PropsFromState & PropsFromDispatch;

const ConnectedMineTable = ({
  factories,
  setMineCount,
  setTechedMiningRate,
  adjustProductionRequirementsToGivenAmount,
  mines,
  marketPrices,
}: MineTableType) => (
  <Table fullwidth narrow striped bordered hoverable>
    <MineHeading />
    <Table.Body>
      {MINE_ORDER.map(mineID => (
        <Mine
          {...{
            factories,
            mines,
            mine: getMineByID(mines, mineID),
            marketPrices,
            setMineCount,
            setTechedMiningRate,
            adjustProductionRequirementsToGivenAmount,
            key: mineID,
          }}
        />
      ))}
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

const mapStateToProps = ({ mines, factories, marketPrices }: MineTableType) => ({ mines, factories, marketPrices });

const mapDispatchToProps = {
  setMineCount,
  setMines,
  setTechedMiningRate,
  adjustProductionRequirementsToGivenAmount,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const MineTable = preconnect(ConnectedMineTable);
MineTable.displayName = 'MineTable';
//@ts-ignore
MineTable.whyDidYouRender = true;
