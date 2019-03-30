import React from 'react';
import { Navigation } from './../Navigation';

interface HeaderProps {
  isAuthenticated: boolean;
}

export const Header = ({ isAuthenticated }: HeaderProps) => (
  <header>
    <Navigation isAuthenticated={isAuthenticated} />
  </header>
);
