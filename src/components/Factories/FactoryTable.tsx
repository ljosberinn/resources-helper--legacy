import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { connect } from 'react-redux';
import {
  setLevel,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
  adjustProductionRequirementsToGivenAmount,
  setWorkload,
} from '../../actions/Factories';
import { getFactoryUpgradeSum, calculationOrder, getFactoryByID } from '../helperFunctions';
import { FactoryOverview } from './FactoryOverview';
import { FactoryDetails } from './FactoryDetails';
import { IMarketPriceState } from '../../types/marketPrices';
import { Table } from 'rbx';
import { FactoryHeading } from './FactoryHeading';

interface PropsFromState {
  factories: IFactory[];
  marketPrices: IMarketPriceState[];
}
interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
  adjustProductionRequirementsToGivenAmount: typeof adjustProductionRequirementsToGivenAmount;
  setWorkload: typeof setWorkload;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = ({
  marketPrices,
  factories,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
  adjustProductionRequirementsToGivenAmount,
  setWorkload,
  setLevel,
}: FactoryTableType) => (
  <Table hoverable narrow striped fullwidth bordered>
    <FactoryHeading />
    <tbody>
      {calculationOrder.map(factoryID => {
        const factory = getFactoryByID(factories, factoryID);

        return (
          <Fragment key={factoryID}>
            <FactoryOverview
              {...{
                marketPrices,
                factories,
                factory,
                setLevel,
                toggleFactoryDetailsVisibility,
                adjustProductionRequirementsToLevel,
                adjustProductionRequirementsToGivenAmount,
                setWorkload,
                key: factoryID,
              }}
            />
            <FactoryDetails data={factory} />
          </Fragment>
        );
      })}
    </tbody>
    <tfoot>
      <tr>
        <td>{getFactoryUpgradeSum(factories)}</td>
      </tr>
    </tfoot>
  </Table>
);

const mapStateToProps = ({ factories, marketPrices }: FactoryTableType) => ({ factories, marketPrices });

const mapDispatchToProps = {
  setLevel,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
  adjustProductionRequirementsToGivenAmount,
  setWorkload,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const FactoryTable = preconnect(ConnectedFactoryTable);
FactoryTable.displayName = 'FactoryTable';
//@ts-ignore
FactoryDetails.whyDidYouRender = true;
