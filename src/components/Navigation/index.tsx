import React, { memo } from 'react';

const navElements = {
  Login: { href: 'signup', component: 'Login' },
  API: { href: 'api', component: 'API' },
  Mines: { href: 'mines', component: 'Mines' },
  Factories: { href: 'factories', component: 'Factories' },
  'Material Flow': { href: 'flow', component: 'Login' },
  Warehouses: { href: 'wh', component: 'Warehouses' },
  'Special Buildings': { href: 'buildings', component: 'Buildings' },
  Recycling: { href: 'recycling', component: 'Recycling' },
  Units: { href: 'units', component: 'Units' },
};

export const Navigation = memo(() => (
  <nav>
    <ul>
      {Object.entries(navElements).map(([title, meta], key) => {
        const { href } = meta;

        return (
          <li key={key}>
            <a href={`/${href}`}>{title}</a>
          </li>
        );
      })}
    </ul>
  </nav>
));