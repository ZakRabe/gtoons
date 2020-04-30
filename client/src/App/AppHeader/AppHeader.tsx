import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
} from 'carbon-components-react/lib/components/UIShell';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isLoggedIn, logOut } from '../../utils/auth';
import { goto } from '../../utils/misc';
import { AppHeaderProps } from './types';
import './styles.css';

const AppHeader: React.FunctionComponent<AppHeaderProps> = (props) => {
  const { history } = props;

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const renderLoggedInMenu = () => {
    return (
      <>
        <HeaderNavigation>
          <HeaderMenuItem href="/lobbies">
            <i className="fas fa-search"></i> &nbsp;Lobbies
          </HeaderMenuItem>
          <HeaderMenuItem href="/deckBuilder">
            <i className="fas fa-tools"></i> &nbsp;Deck Builder
          </HeaderMenuItem>
          <HeaderMenuItem href="/sandbox">
            <i className="fas fa-flask"></i> &nbsp;Sandbox
          </HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar
          style={{ fontSize: '1.25rem' }}
          className="appHeaderActions"
        >
          <HeaderGlobalAction onClick={() => {}}>
            <i className="fas fa-bell"></i>
          </HeaderGlobalAction>

          <HeaderGlobalAction
            isActive={userMenuOpen}
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <i className="fas fa-user-cog"></i>
          </HeaderGlobalAction>

          <HeaderGlobalAction
            onClick={goto(history, 'https://discord.gg/W9Z9hSG')}
          >
            <i className="fab fa-discord"></i>
          </HeaderGlobalAction>
          <HeaderPanel expanded={userMenuOpen} className="profileMenu">
            <Switcher>
              <SwitcherItem onClick={() => {}}>
                <i className="fas fa-user"></i>&nbsp; My Profile
              </SwitcherItem>

              <SwitcherItem
                onClick={() => {
                  logOut();
                  goto(history, '/');
                }}
              >
                <i className="fas fa-sign-out-alt"></i>&nbsp; Log out
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </HeaderGlobalBar>
      </>
    );
  };

  const renderLoggedOutMenu = () => {
    return (
      <>
        <HeaderNavigation>
          <HeaderMenuItem href="/login">
            <i className="fas fa-sign-in-alt"></i>&nbsp; Log In
          </HeaderMenuItem>
          <HeaderMenuItem href="/register">
            <i className="fas fa-user-plus"></i>&nbsp; Sign Up
          </HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar style={{ fontSize: '1.25rem' }}>
          <HeaderGlobalAction
            style={{ color: 'white' }}
            onClick={goto(history, 'https://discord.gg/W9Z9hSG')}
          >
            <i className="fab fa-discord"></i>
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </>
    );
  };

  const renderAppHeader = () => {
    return (
      <Header className="appHeader">
        <HeaderName href="/" prefix="">
          reToons
        </HeaderName>
        {isLoggedIn() ? renderLoggedInMenu() : renderLoggedOutMenu()}
      </Header>
    );
  };

  return renderAppHeader();
};

export default withRouter(AppHeader);
