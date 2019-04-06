import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Factories } from './Factories';
import { Login } from './Authentication/Login';
import { Logout } from './Authentication/Logout';
import { IPreloadedState } from '../types';
import { Registration } from './Authentication/Registration';
import { Mines } from './Mines';

const devComponent = () => <div>coming soon</div>;

interface IRoutesProps {
  state: IPreloadedState;
}

const routes = [
  {
    path: '/',
    component: devComponent,
    requiresAuth: false,
  },
  {
    path: '/factories',
    component: Factories,
    requiresAuth: false,
  },
  {
    path: '/mines',
    component: Mines,
    requiresAuth: false,
  },
  {
    path: '/logout',
    component: Logout,
    requiresAuth: true,
  },
  {
    path: '/login',
    component: Login,
    requiresAuth: false,
  },
  {
    path: '/register',
    component: Registration,
    requiresAuth: false,
  },
];

export const Routes = ({ state }: IRoutesProps) => (
  <Fragment>
    <main>
      <Switch>
        {routes.map((route, index) => {
          if (!state.user.isAuthenticated && route.requiresAuth) {
            return null;
          }

          return <Route path={route.path} component={route.component} exact={true} key={index} />;
        })}
        {/*<Route exact path="/" component={devComponent} />
        <Route exact path="/factories" component={Factories} />
        <Route exact path="/mines" component={Mines} />
        {state.user.isAuthenticated ? (
          <Route exact path="/logout" component={Logout} />
        ) : (
          <Fragment>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Registration} />
          </Fragment>
        )}
        <Route component={() => <div>404</div>} />*/}
      </Switch>
    </main>
  </Fragment>
);

Routes.whyDidYouRender = true;
