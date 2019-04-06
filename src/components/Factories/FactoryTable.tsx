import React from 'react';
import Factory from './Factory';
import { IFactory } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';
import { IMineState } from '../../types/mines';
import { getFactoryUpgradeSum } from '../helperFunctions';

interface PropsFromState {
  factories: IFactory[];
  mines: IMineState[];
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = (props: FactoryTableType) => {
  const { factories, toggleFactoryDetailsVisibility, adjustRequirementsToLevel, setLevel } = props;

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {factories.map(factory => (
          <Factory
            {...{
              factory,
              setLevel,
              toggleFactoryDetailsVisibility,
              adjustRequirementsToLevel,
              key: factory.id,
            }}
          />
        ))}
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
