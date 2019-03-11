import * as React                         from 'react';
import { IFactory }                       from '../../types/factory';
import { ChangeEvent, FunctionComponent } from 'react';

interface FactoryProps {
  data: IFactory;
  name: string;
  placeholderText: string;
}

const extractChangeEventValue = (event: ChangeEvent): number => parseInt((event.currentTarget as HTMLInputElement).value);

const Factory: FunctionComponent<FactoryProps> = (props: FactoryProps) => {

  const { data, name, placeholderText } = props;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <input type={'number'} key={data.id} placeholder={placeholderText} defaultValue={data.level.toString()}
               onChange={(e: ChangeEvent) => console.log(extractChangeEventValue(e))} min={0} max={5000}/>
      </td>
      <td>{data.scaling * data.level}</td>
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
