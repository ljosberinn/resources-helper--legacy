import * as React       from 'react';
import { WeakLoadable } from '../Shared/Loadable';

const navElements = {
  Login               : { href: 'signup', component: 'Login' },
  API                 : { href: 'api', component: 'API' },
  Mines               : { href: 'mines', component: 'Mines' },
  Factories           : { href: 'factories', component: 'Factories' },
  'Giant Diamond Calc': { href: 'gd', component: 'Login' },
  'Material Flow'     : { href: 'flow', component: 'Login' },
  Warehouses          : { href: 'wh', component: 'Warehouses' },
  'Special Buildings' : { href: 'buildings', component: 'Buildings' },
  Recycling           : { href: 'recycling', component: 'Recycling' },
  Units               : { href: 'units', component: 'Units' },
};

const filterNavElements = (href: string): string => {
  let component = 'Login';

  Object.entries(navElements).forEach(entry => {
    const meta = entry[1];

    if (meta.href === href) {
      component = meta.component;
    }
  });

  return component;
};

const asyncAPI = WeakLoadable({ loader: () => import('../API/API') });
const asyncFactories = WeakLoadable({ loader: () => import('../Factories/Factories') });
const asyncBuildings = WeakLoadable({ loader: () => import(/* webpackChunkName: "specialBuildings" */'../Buildings/SpecialBuildings') });

const Preloader = (href: string) => {

  const component = filterNavElements(href);

  switch (component) {
    case 'API':
      return asyncAPI.preload();
    case 'Factories':
      return asyncFactories.preload();
    case 'Buildings':
      return asyncBuildings.preload();
  }
};

const mouseOverPreload = (href: string) => Preloader(href);

const Navigation: React.FunctionComponent = () => {

  return (
    <nav>
      <ul>
        {
          Object.entries(navElements).map((entries, key) => {
            const [title, meta] = entries;
            const { href } = meta;

            return <li key={key}><a href={`/${href}`} onMouseOver={() => mouseOverPreload(href)}>{title}</a></li>;
          })
        }
      </ul>
    </nav>
  );
};

export default Navigation;
