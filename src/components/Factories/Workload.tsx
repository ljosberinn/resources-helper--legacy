import React, { memo } from 'react';

interface WorkloadProps {
  workload: number;
}

export const Workload = memo(({ workload }: WorkloadProps) => (
  <td className="has-text-right">{(workload * 100).toFixed(2).toString()}%</td>
));
