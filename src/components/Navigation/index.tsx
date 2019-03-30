import React, { memo } from 'react';

const navElements = [
  { displayName: 'Login', href: 'login', requiresGuest: true, requiresLogin: false },
  { displayName: 'Registration', href: 'register', requiresGuest: true, requiresLogin: false },

  { displayName: 'Dashboard', href: 'dashboard', requiresGuest: false, requiresLogin: false },
  { displayName: 'API', href: 'api', requiresGuest: false, requiresLogin: false },

  { displayName: 'Mines', href: 'mines', requiresGuest: false, requiresLogin: false },
  { displayName: 'Factories', href: 'factories', requiresGuest: false, requiresLogin: false },
  { displayName: 'Material Flow', href: 'flow', requiresGuest: false, requiresLogin: false },
  { displayName: 'Warehouses', href: 'warehouses', requiresGuest: false, requiresLogin: false },
  { displayName: 'Special Buildings', href: 'buildings', requiresGuest: false, requiresLogin: false },
  { displayName: 'Recycling', href: 'recycling', requiresGuest: false, requiresLogin: false },
  { displayName: 'Units', href: 'units', requiresGuest: false, requiresLogin: false },

  { displayName: 'Logout', href: 'logout', requiresGuest: false, requiresLogin: true },
];

interface INavigationProps {
  isAuthenticated: boolean;
}

export const Navigation = memo(({ isAuthenticated }: INavigationProps) => (
  <nav>
    <ul>
      {Object.entries(navElements).map(([key, { displayName, href, requiresGuest, requiresLogin }]) => {
        const invisible = (isAuthenticated && requiresGuest) || (!isAuthenticated && requiresLogin);

        if (invisible) {
          return null;
        }

        return (
          <li key={key}>
            <a href={`/${href}`}>{displayName}</a>
          </li>
        );
      })}
    </ul>
  </nav>
));
