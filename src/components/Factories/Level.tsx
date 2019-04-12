import React, { ChangeEvent, FocusEvent } from 'react';
import { setLevel, adjustProductionRequirementsToLevel } from '../../actions/Factories';
import { IFactoryProductionRequirements, FactoryIDs } from '../../types/factory';
import { DebounceInput } from 'react-debounce-input';
import { Input } from 'rbx';
interface ILevelProps {
  level: number;
  id: FactoryIDs;
  productionRequirements: IFactoryProductionRequirements[];
  setLevel: typeof setLevel;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
}

// replaces reducer
const scaleRequirements = (requirements: IFactoryProductionRequirements[], level: number) =>
  requirements.map(requirement => ({
    ...requirement,
    currentRequiredAmount: requirement.amountPerLevel * level,
  }));

export const Level = ({ level, id, productionRequirements, setLevel, adjustProductionRequirementsToLevel }: ILevelProps) => {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);
    if (Number.isNaN(level)) {
      return;
    }

    // TODO:
    // somehow cascade level change to dependant factories

    setLevel(level, id);
    adjustProductionRequirementsToLevel(id, scaleRequirements(productionRequirements, level));
  };

  return (
    <Input
      as={DebounceInput}
      type="number"
      placeholder="PH"
      value={level.toString()}
      min={0}
      max={5000}
      onFocus={handleFocus}
      onChange={handleChange}
      debounceTimeout={300}
      size={'small'}
      className="has-text-right"
    />
  );
};
