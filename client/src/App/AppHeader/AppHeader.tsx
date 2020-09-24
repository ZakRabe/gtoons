import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  HeaderSideNavItems,
  SideNav,
  SideNavItems,
  Switcher,
  SwitcherItem,
} from 'carbon-components-react/lib/components/UIShell';
import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isLoggedIn, logOut } from '../../utils/auth';
import { goto } from '../../utils/misc';
import './styles.css';
import { AppHeaderProps } from './types';
import UserContext from '../../contexts/UserContext';
import { request } from '../../utils/api';

const AppHeader: React.FunctionComponent<AppHeaderProps> = (props) => {
  const { history } = props;
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    request({
      url: 'login/validateToken',
    })
      .then(({ user: authdUser }) => {
        // console.log(user);
        // this means the token was still valid, so there's no need to be on this page

        if (!user || user.userId !== authdUser.userId) {
          setUser(authdUser);
        }
      })
      .catch(() => {
        setUser(null);
        // the token was already cleared in the request helper upon recieveing a 401
      });
  });

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

  const onClickSideNavExpand = () => {
    setIsSideNavExpanded((prev) => !prev);
  };

  const renderLoggedInMenu = () => {
    return (
      <>
        <HeaderNavigation>
          <HeaderMenuItem
            onClick={() => history.push('/lobbies')}
            className={'lobbies'}
          >
            <i className="fas fa-globe-americas"></i>&nbsp; Lobbies
          </HeaderMenuItem>
          <HeaderMenuItem
            onClick={() => history.push('/deckList')}
            className={'decks'}
          >
            <i className="fas fa-tools"></i>&nbsp; Decks
          </HeaderMenuItem>
          <HeaderMenuItem href="/sandbox">
            <i className="fas fa-flask"></i> &nbsp;Sandbox
          </HeaderMenuItem>
        </HeaderNavigation>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}
        >
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem onClick={() => history.push('/lobbies')}>
                <i className="fas fa-search"></i>&nbsp; Lobbies
              </HeaderMenuItem>
              <HeaderMenuItem onClick={() => history.push('/deckList')}>
                <i className="fas fa-tools"></i>&nbsp; Decks
              </HeaderMenuItem>
              <HeaderMenuItem href="/sandbox">
                <i className="fas fa-flask"></i> &nbsp;Sandbox
              </HeaderMenuItem>
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>

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
              <SwitcherItem onClick={() => history.push('/profile')}>
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
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}
        >
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem onClick={() => history.push('/login')}>
                <i className="fas fa-sign-in-alt"></i>&nbsp; Log In
              </HeaderMenuItem>
              <HeaderMenuItem onClick={() => history.push('/register')}>
                <i className="fas fa-user-plus"></i>&nbsp; Sign Up
              </HeaderMenuItem>
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>

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
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName
          // @ts-ignore
          style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => history.push('/')}
          prefix=""
          title="0.1.0"
        >
          reToons <span>α</span>
        </HeaderName>
        {isLoggedIn() ? renderLoggedInMenu() : renderLoggedOutMenu()}
      </Header>
    );
  };

  return renderAppHeader();
};

export default withRouter(AppHeader);
