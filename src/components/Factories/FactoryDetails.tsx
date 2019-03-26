import React from 'react';
import { FactoryProps } from '../../types/factory';

interface PropsFromState extends FactoryProps {}

export const FactoryDetails = ({ data }: PropsFromState) => (
  <tr hidden={!data.hasDetailsVisible}>
    <td>ROI</td>
    <td>GD Information</td>
    <td>Total Materials built with</td>
  </tr>
);
