import React, { memo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from 'rbx';

const navElements = [
  { displayName: 'Dashboard', href: 'dashboard', requiresGuest: false, requiresLogin: false },
  { displayName: 'API', href: 'api', requiresGuest: false, requiresLogin: false },

  { displayName: 'Mines', href: 'mines', requiresGuest: false, requiresLogin: false },
  { displayName: 'Factories', href: 'factories', requiresGuest: false, requiresLogin: false },
  { displayName: 'Material Flow', href: 'flow', requiresGuest: false, requiresLogin: false },
  { displayName: 'Warehouses', href: 'warehouses', requiresGuest: false, requiresLogin: false },
  { displayName: 'Special Buildings', href: 'buildings', requiresGuest: false, requiresLogin: false },
  { displayName: 'Recycling', href: 'recycling', requiresGuest: false, requiresLogin: false },
  { displayName: 'Units', href: 'units', requiresGuest: false, requiresLogin: false },
  { displayName: 'HQ Planner', href: 'hqplanner', requiresGuest: false, requiresLogin: false },
];

interface INavigationProps {
  isAuthenticated: boolean;
}

export const Navigation = memo(({ isAuthenticated }: INavigationProps) => (
  <Navbar>
    <Navbar.Burger />
    <Navbar.Menu>
      <Navbar.Segment align="start">
        {Object.entries(navElements).map(([key, { displayName, href, requiresGuest, requiresLogin }]) => {
          const invisible = (isAuthenticated && requiresGuest) || (!isAuthenticated && requiresLogin);

          if (invisible) {
            return null;
          }

          return (
            <Navbar.Item key={key} as={Link} to={`/${href}`}>
              {displayName}
            </Navbar.Item>
          );
        })}
      </Navbar.Segment>

      <Navbar.Segment align="end">
        {!isAuthenticated && (
          <Fragment>
            <Navbar.Item as={Link} to={'/register'}>
              <Button color="primary">
                <strong>Register</strong>
              </Button>
            </Navbar.Item>
            <Navbar.Item as={Link} to={'/login'}>
              <Button color="success">Login</Button>
            </Navbar.Item>
          </Fragment>
        )}
        {isAuthenticated && (
          <Navbar.Item as={Link} to={'/logout'}>
            <Button color="warning">Logout</Button>
          </Navbar.Item>
        )}
      </Navbar.Segment>
    </Navbar.Menu>
  </Navbar>
));
