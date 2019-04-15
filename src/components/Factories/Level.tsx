import React, { ChangeEvent } from 'react';
import {
  setLevel,
  adjustProductionRequirementsToLevel,
  setWorkload,
  adjustProductionRequirementsToGivenAmount,
} from '../../actions/Factories';
import { IFactoryProductionRequirements, FactoryIDs, IFactory } from '../../types/factory';
import { DebounceInput } from 'react-debounce-input';
import { Input } from 'rbx';
import { handleFocus, recursiveFactoryWorkloadRecalculation, getFactoryByID } from '../../helperFunctions';
import { getWorkload } from './FactoryOverview';

interface ILevelProps {
  factories: IFactory[];
  level: number;
  id: FactoryIDs;
  productionRequirements: IFactoryProductionRequirements[];
  dependantFactories: FactoryIDs[];
  setLevel: typeof setLevel;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
  adjustProductionRequirementsToGivenAmount: typeof adjustProductionRequirementsToGivenAmount;
  setWorkload: typeof setWorkload;
}

// replaces reducer
const scaleRequirements = (requirements: IFactoryProductionRequirements[], level: number) =>
  requirements.map(requirement => ({
    ...requirement,
    currentRequiredAmount: requirement.amountPerLevel * level,
  }));

export const Level = ({
  factories,
  level,
  id,
  productionRequirements,
  dependantFactories,
  setLevel,
  setWorkload,
  adjustProductionRequirementsToLevel,
  adjustProductionRequirementsToGivenAmount,
}: ILevelProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value);
    if (Number.isNaN(newLevel) || level === newLevel) {
      return;
    }

    setLevel(newLevel, id);
    adjustProductionRequirementsToLevel(id, scaleRequirements(productionRequirements, newLevel));

    const factory = getFactoryByID(factories, id);
    const workload = getWorkload(factory);

    // givenAmount is workload agnostic
    const newGivenAmount = Math.round(factory.scaling * newLevel * (workload > 1 ? 1 : workload));

    dependantFactories.forEach(dependantFactoryID =>
      adjustProductionRequirementsToGivenAmount(dependantFactoryID, factory.productID, newGivenAmount),
    );
    setWorkload(id, workload);

    return;

    recursiveFactoryWorkloadRecalculation(factories, dependantFactories, setWorkload);
  };

  return (
    <Input
      as={DebounceInput}
      type="number"
      placeholder="PH"
      value={level}
      min="0"
      max="5000"
      onFocus={handleFocus}
      onChange={handleChange}
      debounceTimeout={300}
      size={'small'}
      className="has-text-right"
    />
  );
};
