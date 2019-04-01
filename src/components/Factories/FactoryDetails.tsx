import React, { memo } from 'react';
import { IFactory } from '../../types/factory';

interface IFactoryDetailsProps {
  data: IFactory;
}

export const FactoryDetails = memo(({ data }: IFactoryDetailsProps) => (
  <tr hidden={!data.hasDetailsVisible}>
    <td>ROI</td>
    <td>GD Information</td>
    <td>Total Materials built with</td>
  </tr>
));

FactoryDetails.displayName = 'FactoryDetails';
