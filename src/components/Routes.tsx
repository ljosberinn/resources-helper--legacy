import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Factories } from './Factories/Factories';
import { Login } from './Authentication/Login';
import { Logout } from './Authentication/Logout';
import { IPreloadedState } from '../types';
import { Registration } from './Authentication/Registration';

const devComponent = () => <div>coming soon</div>;

interface IRoutesProps {
  state: IPreloadedState;
}

export const Routes = ({ state }: IRoutesProps) => (
  <Fragment>
    <main>
      <Switch>
        <Route exact path="/" component={devComponent} />
        <Route exact path="/factories" component={Factories} />
        {state.user.isAuthenticated ? (
          <Route exact path="/logout" component={Logout} />
        ) : (
          <Fragment>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Registration} />
          </Fragment>
        )}
        <Route component={() => <div>404</div>} />
      </Switch>
    </main>
  </Fragment>
);
