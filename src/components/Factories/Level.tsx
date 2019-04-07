import React, { ChangeEvent, FocusEvent } from 'react';
import { setLevel, adjustRequirementsToLevel } from '../../actions/Factories';
import { IFactoryRequirements } from '../../types/factory';

interface ILevelProps {
  level: number;
  id: number;
  requirements: IFactoryRequirements[];
  setLevel: typeof setLevel;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

// replaces reducer
const scaleRequirements = (requirements: IFactoryRequirements[], level: number) =>
  requirements.map(requirement => ({
    ...requirement,
    currentRequiredAmount: requirement.amountPerLevel * level,
  }));

export const Level = ({ level, id, requirements, setLevel, adjustRequirementsToLevel }: ILevelProps) => {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);
    if (Number.isNaN(level)) {
      return;
    }

    // TODO:
    // somehow cascade level change to dependant factories

    setLevel(level, id);
    adjustRequirementsToLevel(id, scaleRequirements(requirements, level));
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
