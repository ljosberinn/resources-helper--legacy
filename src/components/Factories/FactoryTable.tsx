import * as React from 'react';
import { IFactoryLocalization } from './interfaces';
import { IFactory } from '../../types/factory';
import Factory from './Factory';

interface IProps {
  localization: IFactoryLocalization;
  factories: IFactory[];
}

const FactoryTable: React.FunctionComponent<IProps> = ({ localization, factories }) => (
  <table style={{ width: '100%' }}>
    <thead>
      <tr>
        {localization.tableColumns.map(th => (
          <th key={localization.tableColumns.indexOf(th)}>{th}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <React.Fragment>
        {factories.map(factory => (
          <Factory
            data={factory}
            name={localization.factoryNames[factory.id]}
            placeholderText={localization.inputPlaceholder}
            key={factory.id}
          />
        ))}
      </React.Fragment>
    </tbody>
  </table>
);

export default FactoryTable;
