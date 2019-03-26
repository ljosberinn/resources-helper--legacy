import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Factories } from './Factories/Factories';

const devComponent = () => <div>coming soon</div>;

export const Routes = () => (
  <Fragment>
    <main>
      <Switch>
        <Route exact path="/" component={devComponent} />
        <Route exact path="/factories" component={Factories} />
        <Route component={() => <div>404</div>} />
      </Switch>
    </main>
  </Fragment>
);
