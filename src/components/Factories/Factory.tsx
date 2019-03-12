import * as React            from 'react';
import { FunctionComponent } from 'react';
import Scaling               from './Scaling';
import Level                 from './Level';
import { FactoryProps }      from './interfaces';

const Factory: FunctionComponent<FactoryProps> = (props: FactoryProps) => {

  const { data, name, placeholderText } = props;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Level factoryID={data.id} level={data.level} key={data.id} placeholderText={placeholderText}/>
      </td>
      <td><Scaling scaling={data.scaling} level={data.level}/></td>
      <td>{data.dependencies.length}</td>
      <td>Workload</td>
      <td>Turnover</td>
      <td>Turnover Increase per Upgrade</td>
      <td>Upgrade Cost</td>
      <td>ROI</td>
    </tr>
  );
};

export default Factory;
