import React, { Fragment, memo } from 'react';
import { IFactory } from '../../types/factory';
import { FactoryDetails } from './FactoryDetails';
import { FactoryOverview } from './FactoryOverview';
import { IMineState } from '../../types/mines';
import { setLevel, toggleFactoryDetailsVisibility } from '../../actions/Factories';

export interface FactoryProps {
  factory: IFactory;
  mines: IMineState[];
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
}

const Factory = memo((props: FactoryProps) => (
  <Fragment>
    <FactoryOverview {...props} />
    <FactoryDetails data={props.factory} />
  </Fragment>
));

export default Factory;
Factory.displayName = 'Factory';
