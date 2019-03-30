import React, { Fragment } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Routes } from './Routes';

interface IRHelperProps {
  store: any;
}

export const RHelper = ({ store }: IRHelperProps) => {
  const state = store.getState();

  return (
    <Fragment>
      <Header isAuthenticated={state.user.isAuthenticated} />
      <Routes state={state} />
      <Footer />
    </Fragment>
  );
};
