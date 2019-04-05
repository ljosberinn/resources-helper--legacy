import React, { Fragment } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Routes } from './Routes';
import { Store } from 'redux';

interface RHelperProps {
  store: Store;
}

export const RHelper = ({ store }: RHelperProps) => {
  const state = store.getState();

  return (
    <Fragment>
      <Header isAuthenticated={state.user.isAuthenticated} />
      <Routes state={state} />
      <Footer />
    </Fragment>
  );
};

RHelper.whyDidYouRender = true;