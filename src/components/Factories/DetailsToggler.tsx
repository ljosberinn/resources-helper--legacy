import React, { MouseEvent } from 'react';
import { toggleFactoryDetailsVisibility } from '../../actions/Factories';

interface IDetailsTogglerProps {
  id: number;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

export const DetailsToggler = ({ id, toggleFactoryDetailsVisibility }: IDetailsTogglerProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const parentTR = e.currentTarget.closest('tr') as HTMLTableRowElement;
    const detailsTR = parentTR.nextElementSibling as HTMLTableRowElement;

    detailsTR.hidden = !detailsTR.hidden;

    toggleFactoryDetailsVisibility(id);
  };

  return <button onClick={handleClick}>Details</button>;
};
