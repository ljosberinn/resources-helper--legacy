import React, { memo } from 'react';
import Factory from './Factory';
import { IFactories, IFactoryDependency } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility } from '../../actions/Factories';
import { IMineState } from '../../types/mines';
interface PropsFromState {
  factories: IFactories;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = memo(
  ({ factories, mines, setLevel, toggleFactoryDetailsVisibility }: FactoryTableType) => {
    const mineData = Object.values(mines);

    const getRelevantMines = (factoryDependencies: IFactoryDependency[]): IMineState[] => {
      const factoryDependencyIDs: number[] = factoryDependencies.reduce((result: number[], dependency) => {
        if (dependency.id > 1) {
          result.push(dependency.id);
        }

        return result;
      }, []);

      return mineData.filter(({ resourceID }) => factoryDependencyIDs.includes(resourceID));
    };

    return (
      <table>
        <thead>
          <tr />
        </thead>
        <tbody>
          {Object.values(factories).map(factory => (
            <Factory
              mines={getRelevantMines(factory.productionDependencies)}
              factory={factory}
              setLevel={setLevel}
              toggleFactoryDetailsVisibility={toggleFactoryDetailsVisibility}
              key={factory.id}
            />
          ))}
        </tbody>
      </table>
    );
  },
);

const mapStateToProps = ({ factories, mines, setLevel }: FactoryTableType) => ({ factories, mines, setLevel });

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
