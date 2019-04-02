import React, { memo } from 'react';
import Factory from './Factory';
import { IFactories, IFactoryRequirements } from '../../types/factory';
import { connect } from 'react-redux';
import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';
import { IMineState } from '../../types/mines';
interface PropsFromState {
  factories: IFactories;
  mines: IMineState[];
}

interface PropsFromDispatch {
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

type FactoryTableType = PropsFromState & PropsFromDispatch;

export const ConnectedFactoryTable = memo((Props: FactoryTableType) => {
  const { factories, mines } = Props;
  const mineData = Object.values(mines);

  const getRelevantMines = (requirements: IFactoryRequirements[]): IMineState[] => {
    const requirementIDs: number[] = requirements.reduce((result: number[], { id }) => {
      // ignore cash requirement
      if (id > 1) {
        result.push(id);
      }

      return result;
    }, []);

    return mineData.filter(({ resourceID }) => requirementIDs.includes(resourceID));
  };

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {Object.values(factories).map(factory => (
          <Factory
            mines={getRelevantMines(factory.requirements)}
            factory={factory}
            setLevel={Props.setLevel}
            toggleFactoryDetailsVisibility={Props.toggleFactoryDetailsVisibility}
            adjustRequirementsToLevel={Props.adjustRequirementsToLevel}
            key={factory.id}
          />
        ))}
      </tbody>
    </table>
  );
});

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
