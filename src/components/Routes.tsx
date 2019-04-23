import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { IPreloadedState } from '../types';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import { Loading } from './Shared/Loading';

const LoadInterceptor = (props: LoadingComponentProps) => {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  }

  if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  }

  if (props.pastDelay) {
    return <Loading />;
  }

  return null;
};

const LoadingFactory = (component: Promise<React.ComponentType | { default: React.ComponentType }>) =>
  Loadable({
    loader: () => component,
    loading: LoadInterceptor,
    timeout: 10000,
    delay: 300,
  });

const Factories = LoadingFactory(import('./Factories'));
const Login = LoadingFactory(import('./Authentication/Login'));
const Logout = LoadingFactory(import('./Authentication/Logout'));
const Registration = LoadingFactory(import('./Authentication/Registration'));
const HQPlanner = LoadingFactory(import('./HQPlanner'));
const PlaceholderComponent = LoadingFactory(import('./placeholderComponent'));

const routes = [
  {
    path: '/',
    component: PlaceholderComponent,
    requiresAuth: false,
  },
  {
    path: '/factories',
    component: Factories,
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
  {
    path: '/hqplanner',
    component: HQPlanner,
    requiresAuth: false,
  },
  ,
];

interface IRoutesProps {
  state: IPreloadedState;
}

export const Routes = ({ state }: IRoutesProps) => (
  <Fragment>
    <main>
      <Switch>
        {routes.map((route, index) => {
          //@ts-ignore
          if (!state.user.isAuthenticated && route.requiresAuth) {
            return null;
          }

          //@ts-ignore
          return <Route path={route.path} component={route.component} exact={true} key={index} onMouseOver={route.component.preload()} />;
        })}
      </Switch>
    </main>
  </Fragment>
);

Routes.whyDidYouRender = true;
