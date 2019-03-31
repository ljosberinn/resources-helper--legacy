import React, { Fragment, memo } from 'react';
import Factory from './Factory';
import { IFactories } from '../../types/factory';

interface IFactoryTableProps {
  factories: IFactories;
}

export const FactoryTable = memo(({ factories }: IFactoryTableProps) => (
  <table style={{ width: '100%' }}>
    <thead>
      <tr />
    </thead>
    <tbody>
      {Object.values(factories).map(factory => (
        <Factory data={factory} key={factory.id} />
      ))}
    </tbody>
  </table>
));

FactoryTable.displayName = 'FactoryTable';
