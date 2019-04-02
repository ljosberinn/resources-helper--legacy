import React, { Fragment, memo } from 'react';

interface IScalingProps {
  id: number;
  level: number;
  scaling: number;
}

const calcScaling = (level: number, scaling: number) => (scaling * (Number.isNaN(level) ? 0 : level)).toLocaleString();

export const Scaling = memo(({ level, scaling }: IScalingProps) => <Fragment>{calcScaling(level, scaling)}</Fragment>);

Scaling.displayName = 'Scaling';
