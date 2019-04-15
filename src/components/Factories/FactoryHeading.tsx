import React, { memo } from 'react';

export const FactoryHeading = memo(() => (
  <thead>
    <tr>
      {[
        'factoryID',
        'factoryLevel',
        'production/h',
        'dependencies',
        'workload',
        'profit/h',
        'profit increase/upgrade',
        'productionCost/hr',
        'upgradeCost',
        'GD Order Indicator',
        '',
      ].map((text, index) => (
        <th key={index}>
          <abbr title={text}>{text}</abbr>
        </th>
      ))}
    </tr>
  </thead>
));
