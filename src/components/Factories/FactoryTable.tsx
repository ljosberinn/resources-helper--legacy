import React, { memo } from 'react';
import Factory from './Factory';
import { IFactory, IFactoryRequirements } from '../../types/factory';
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

export const ConnectedFactoryTable = memo((props: FactoryTableType) => {
  const { factories, mines, toggleFactoryDetailsVisibility, adjustRequirementsToLevel, setLevel } = props;

  const getRelevantMines = (requirements: IFactoryRequirements[]): IMineState[] => {
    const requirementIDs: number[] = requirements.reduce((result: number[], { id }) => {
      // ignore cash requirement
      if (id > 1) {
        result.push(id);
      }

      return result;
    }, []);

    return mines.filter(({ resourceID }) => requirementIDs.includes(resourceID));
  };

  return (
    <table>
      <thead>
        <tr />
      </thead>
      <tbody>
        {factories.map(factory => (
          <Factory
            mines={getRelevantMines(factory.requirements)}
            factory={factory}
            setLevel={setLevel}
            toggleFactoryDetailsVisibility={toggleFactoryDetailsVisibility}
            adjustRequirementsToLevel={adjustRequirementsToLevel}
            key={factory.id}
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
