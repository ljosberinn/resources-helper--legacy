import React, { Fragment, memo } from 'react';
import { IFactoryRequirements } from '../../types/factory';

interface IRequirementsProps {
  requirements: IFactoryRequirements[];
}

export const Requirements = memo(({ requirements }: IRequirementsProps) => (
  <Fragment>
    {Object.values(requirements).map(dependency => {
      const { id, currentAmount } = dependency;

      return (
        <span key={id}>
          <i className={`icon-${id}`} /> {currentAmount.toLocaleString()}
        </span>
      );
    })}
  </Fragment>
));

Requirements.displayName = 'Requirements';
