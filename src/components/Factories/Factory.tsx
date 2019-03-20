import * as React from 'react';
import { FunctionComponent } from 'react';
import Dependencies from './Dependencies';
import { FactoryProps } from './interfaces';
import Level from './Level';
import Scaling from './Scaling';

const Factory: FunctionComponent<FactoryProps> = (props: FactoryProps) => {
  const { data, name, placeholderText } = props;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Level id={data.id} level={data.level} placeholderText={placeholderText} />
      </td>
      <td>
        <Scaling id={data.id} scaling={data.scaling} level={data.level} />
      </td>
      <td>
        <Dependencies id={data.id} dependencies={data.dependencies} level={data.level} />
      </td>
      <td>Workload</td>
      <td>Turnover</td>
      <td>Turnover Increase per Upgrade</td>
      <td>Upgrade Cost</td>
      <td>ROI</td>
    </tr>
  );
};

export default Factory;
