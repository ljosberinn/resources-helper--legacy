import React, { ChangeEvent, FocusEvent } from 'react';
import { setLevel } from '../../actions/Factories';

interface ILevelProps {
  level: number;
  id: number;
  setLevel: typeof setLevel;
}

export const Level = ({ level, id, setLevel }: ILevelProps) => {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);

    setLevel(level, id);
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
