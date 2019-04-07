import React, { Fragment } from 'react';
import { IFactory } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';
import { IMineState } from '../../types/mines';
import { getFactoryUpgradeSum, calculationOrder } from '../helperFunctions';
import { FactoryOverview } from './FactoryOverview';
import { FactoryDetails } from './FactoryDetails';
import { IMarketPriceState } from '../../types/marketPrices';

interface PropsFromState {
  factories: IFactory[];
  mines: IMineState[];
  marketPrices: IMarketPriceState;
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = (props: FactoryTableType) => {
  const { marketPrices, factories, toggleFactoryDetailsVisibility, adjustRequirementsToLevel, setLevel } = props;

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {calculationOrder.map(factoryID => {
          const factory = factories.find(factory => factory.id === factoryID) as IFactory;

          return (
            <Fragment key={factoryID}>
              <FactoryOverview
                {...{
                  marketPrices,
                  factory,
                  setLevel,
                  toggleFactoryDetailsVisibility,
                  adjustRequirementsToLevel,
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
};

const mapStateToProps = ({ factories, mines }: FactoryTableType) => ({ factories, mines });

const mapDispatchToProps = {
  setLevel,
  toggleFactoryDetailsVisibility,
  adjustRequirementsToLevel,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const FactoryTable = preconnect(ConnectedFactoryTable);
FactoryTable.displayName = 'FactoryTable';
//@ts-ignore
FactoryDetails.whyDidYouRender = true;
