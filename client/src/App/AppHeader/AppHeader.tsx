import React from 'react';
import { Header } from 'semantic-ui-react';
import { AppHeaderProps } from './types';
import AppMenu from '../AppMenu';

const AppHeader: React.FunctionComponent<AppHeaderProps> = (props) => {
  const goto = (path: string) => {
    return () => {
      const { history } = props;
      history.push(path);
    };
  };
  const renderAppHeader = () => {
    return (
      <header>
        <Header
          as="h2"
          onClick={goto('/')}
          style={{ marginTop: 0, cursor: 'pointer' }}
        >
          GToons Revived
        </Header>
        <AppMenu />
      </header>
    );
  };

  return renderAppHeader();
};

export default AppHeader;
