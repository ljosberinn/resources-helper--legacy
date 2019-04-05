import React, { memo } from 'react';
import { Navigation } from './../Navigation';

interface HeaderProps {
  isAuthenticated: boolean;
}

export const Header = memo(({ isAuthenticated }: HeaderProps) => (
  <header>
    <Navigation isAuthenticated={isAuthenticated} />
  </header>
));

Header.displayName = 'Header';
//@ts-ignore
Header.whyDidYouRender = true;