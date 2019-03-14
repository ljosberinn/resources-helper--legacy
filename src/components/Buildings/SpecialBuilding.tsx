import * as React               from 'react';
import { FunctionComponent }    from 'react';
import Level                    from './Level';
import { SpecialBuildingProps } from './interfaces';

const SpecialBuilding: FunctionComponent<SpecialBuildingProps> = (props: SpecialBuildingProps) => {

  const { data, name, placeholderText } = props;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Level buildingID={data.id} level={data.level} key={data.id} placeholderText={placeholderText}/>
      </td>
      <td>{data.dependencies.length}</td>
      <td>Workload</td>
      <td>Turnover</td>
      <td>Turnover Increase per Upgrade</td>
      <td>Upgrade Cost</td>
      <td>ROI</td>
    </tr>
  );
};

export default SpecialBuilding;
