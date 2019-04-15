import React, { memo } from 'react';

interface ProducedQuantityProps {
  productID: number;
  producedQuantity: number;
}

export const ProducedQuantity = memo(({ productID, producedQuantity }: ProducedQuantityProps) => (
  <td className="has-text-right">
    <span>
      {producedQuantity.toLocaleString()}
      <i className={`icon-${productID}`} />
    </span>
  </td>
));
