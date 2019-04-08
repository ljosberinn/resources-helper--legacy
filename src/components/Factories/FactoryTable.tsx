import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility, adjustProductionRequirementsToLevel } from '../../actions/Factories';
import { getFactoryUpgradeSum, calculationOrder, getFactoryByID } from '../helperFunctions';
import { FactoryOverview } from './FactoryOverview';
import { FactoryDetails } from './FactoryDetails';
import { IMarketPriceState } from '../../types/marketPrices';

interface PropsFromState {
  factories: IFactory[];
  marketPrices: IMarketPriceState[];
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = ({
  marketPrices,
  factories,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
  setLevel,
}: FactoryTableType) => (
  <table>
    <thead>
      <tr />
    </thead>
    <tbody>
      {calculationOrder.map(factoryID => {
        const factory = getFactoryByID(factories, factoryID);
        return (
          <Fragment key={factoryID}>
            <FactoryOverview
              {...{
                marketPrices,
                factory,
                setLevel,
                toggleFactoryDetailsVisibility,
                adjustProductionRequirementsToLevel,
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
  </table>
);

const mapStateToProps = ({ factories, marketPrices }: FactoryTableType) => ({ factories, marketPrices });

const mapDispatchToProps = {
  setLevel,
  toggleFactoryDetailsVisibility,
  adjustProductionRequirementsToLevel,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const FactoryTable = preconnect(ConnectedFactoryTable);
FactoryTable.displayName = 'FactoryTable';
//@ts-ignore
FactoryDetails.whyDidYouRender = true;
