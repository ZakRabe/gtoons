import React from 'react';
import { withRouter } from 'react-router-dom';
import { Divider, Header } from 'semantic-ui-react';
import AppMenu from '../AppMenu';
import { AppHeaderProps } from './types';

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
        <Header as="h2" onClick={goto('/')} style={{ cursor: 'pointer' }}>
          gToons Revived
        </Header>
        <Divider />
        <AppMenu />
      </header>
    );
  };

  return renderAppHeader();
};

export default withRouter(AppHeader);
