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
          <HeaderMenuItem onClick={() => history.push('/lobbies')}>
            <i className="fas fa-search"></i>&nbsp; Lobbies
          </HeaderMenuItem>
          <HeaderMenuItem onClick={() => history.push('/deckBuilder')}>
            <i className="fas fa-tools"></i>&nbsp; Deck Builder
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
                  goto(history, '/')();
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
          <HeaderMenuItem onClick={() => history.push('/login')}>
            <i className="fas fa-sign-in-alt"></i>&nbsp; Log In
          </HeaderMenuItem>
          <HeaderMenuItem onClick={() => history.push('/register')}>
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
        <HeaderName
          // @ts-ignore
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/')}
          prefix=""
        >
          reToons
        </HeaderName>
        {isLoggedIn() ? renderLoggedInMenu() : renderLoggedOutMenu()}
      </Header>
    );
  };

  return renderAppHeader();
};

export default withRouter(AppHeader);
