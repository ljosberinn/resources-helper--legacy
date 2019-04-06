import React, { Fragment, memo } from 'react';
import { IFactory } from '../../types/factory';
import { FactoryDetails } from './FactoryDetails';
import { FactoryOverview } from './FactoryOverview';

import { setLevel, toggleFactoryDetailsVisibility, adjustRequirementsToLevel } from '../../actions/Factories';

export interface FactoryProps {
  factory: IFactory;
  setLevel: typeof setLevel;
  toggleFactoryDetailsVisibility: typeof toggleFactoryDetailsVisibility;
  adjustRequirementsToLevel: typeof adjustRequirementsToLevel;
}

const Factory = memo((props: FactoryProps) => {
  return (
    <Fragment>
      <FactoryOverview {...props} />
      <FactoryDetails data={props.factory} />
    </Fragment>
  );
});

export default Factory;
Factory.displayName = 'Factory';
//@ts-ignore
Factory.whyDidYouRender = true;
