import React, { Fragment, memo } from 'react';
import { IFactoryDependency } from '../../types/factory';

interface IProductionDependenciesProps {
  id: number;
  level: number;
  productionDependencies: IFactoryDependency[];
}

const calcDependencyAmount = (amount: number, level: number) =>
  (amount * (Number.isNaN(level) ? 0 : level)).toLocaleString();

export const ProductionDependencies = memo(({ productionDependencies, level }: IProductionDependenciesProps) => (
  <Fragment>
    {productionDependencies.map(dependency => {
      const { id, amount } = dependency;

      return (
        <span key={id}>
          <i className={`icon-${id}`} /> {calcDependencyAmount(amount, level)}
        </span>
      );
    })}
  </Fragment>
));
