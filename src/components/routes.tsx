import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Factories } from './Factories/Factories';
import { Login } from './Authentication/Login';
import { Logout } from './Authentication/Logout';
import { IPreloadedState } from '../types';
import { user } from '../reducers';

const devComponent = () => <div>coming soon</div>;

interface IRoutesProps {
  state: IPreloadedState;
}

export const Routes = ({ state }: IRoutesProps) => {
  return (
    <Fragment>
      <main>
        <Switch>
          <Route exact path="/" component={devComponent} />
          {state.user.isAuthenticated ? (
            <Route exact path="/logout" component={Logout} />
          ) : (
            <Route exact path="/login" component={Login} />
          )}
          <Route exact path="/factories" component={Factories} />
          <Route component={() => <div>404</div>} />
        </Switch>
      </main>
    </Fragment>
  );
};
