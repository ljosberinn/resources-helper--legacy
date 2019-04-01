import React, { memo } from 'react';
import Factory from './Factory';
import { IFactories } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility } from '../../actions/Factories';
interface PropsFromState {
  factories: IFactories;
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = memo(
  ({ factories, setLevel, toggleFactoryDetailsVisibility }: FactoryTableType) => (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {Object.values(factories).map(factory => (
          <Factory
            data={factory}
            setLevel={setLevel}
            toggleFactoryDetailsVisibility={toggleFactoryDetailsVisibility}
            key={factory.id}
          />
        ))}
      </tbody>
    </table>
  ),
);

const mapStateToProps = ({ factories, setLevel }: FactoryTableType) => ({ factories, setLevel });

const mapDispatchToProps = {
  setLevel,
  toggleFactoryDetailsVisibility,
};

const preconnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const FactoryTable = preconnect(ConnectedFactoryTable);
FactoryTable.displayName = 'FactoryTable';
