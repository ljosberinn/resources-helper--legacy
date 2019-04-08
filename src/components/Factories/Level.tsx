import React, { ChangeEvent, FocusEvent } from 'react';
import { setLevel, adjustProductionRequirementsToLevel } from '../../actions/Factories';
import { IFactoryRequirements } from '../../types/factory';

interface ILevelProps {
  level: number;
  id: number;
  productionRequirements: IFactoryRequirements[];
  setLevel: typeof setLevel;
  adjustProductionRequirementsToLevel: typeof adjustProductionRequirementsToLevel;
}

// replaces reducer
const scaleRequirements = (requirements: IFactoryRequirements[], level: number) =>
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
    <input
      type="number"
      placeholder="PH"
      defaultValue={level.toString()}
      min={0}
      max={5000}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  );
};
