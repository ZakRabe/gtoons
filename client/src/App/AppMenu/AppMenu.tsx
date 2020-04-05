import React from 'react';
import { Menu } from 'semantic-ui-react';
import { AppMenuProps } from './types';
import { isLoggedIn, logOut } from '../../utils/auth';

const AppMenu: React.FunctionComponent<AppMenuProps> = (props) => {
  const goto = (path: string) => {
    return () => {
      const { history } = props;
      console.log('goto', path);
      history.push(path);
    };
  };

  const renderNonAuthMenu = () => {
    const {
      location: { pathname },
    } = props;
    return (
      <>
        <Menu.Item>
          <Menu.Header>Join GToons Revived</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={pathname.includes('/login')}
              onClick={goto('/login')}
            >
              Log in to Play
            </Menu.Item>
            <Menu.Item
              active={pathname.includes('/register')}
              onClick={goto('/register')}
            >
              Sign Up
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </>
    );
  };

  const renderUserMenu = () => {
    const {
      location: { pathname },
    } = props;
    return (
      <>
        <Menu.Item>
          <Menu.Header>Play GToons Revived</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={pathname.includes('/lobbies')}
              onClick={goto('/lobbies')}
            >
              Lobbies
            </Menu.Item>
            <Menu.Item
              active={pathname.includes('/deckBuilder')}
              onClick={goto('/deckBuilder')}
            >
              Deck Builder
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Account</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={pathname.includes('/profile')}
              onClick={goto('/profile')}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                logOut();
                console.log('logged out');
                goto('/')();
              }}
            >
              Log out
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </>
    );
  };

  const renderAppMenu = () => {
    return (
      <Menu vertical>
        {isLoggedIn() ? renderUserMenu() : renderNonAuthMenu()}
      </Menu>
    );
  };

  return renderAppMenu();
};

export default AppMenu;
