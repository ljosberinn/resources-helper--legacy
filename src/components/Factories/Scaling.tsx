import * as React            from 'react';
import { FunctionComponent } from 'react';
import { ScalingProps }      from './interfaces';

const Scaling: FunctionComponent<ScalingProps> = (props: ScalingProps) => {

  const { scaling, level } = props;

  return (
    <React.Fragment>
      {scaling * level}
    </React.Fragment>

  );
};

export default Scaling;
