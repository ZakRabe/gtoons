import React from 'react';
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
        <h1 onClick={goto('/')} style={{ marginTop: 0 }}>
          GToons
        </h1>
        <nav>
          <ul>
            <li onClick={goto('/lobbies')}>Play</li>
            <li onClick={goto('/profile')}>Profile</li>
            <li onClick={goto('/decks')}>Deck Builder</li>
          </ul>
        </nav>
      </header>
    );
  };

  return renderAppHeader();
};

export default AppHeader;
