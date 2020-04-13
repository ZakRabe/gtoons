import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSocketNamespace } from '../../utils/hooks';
import { LobbyProps } from './types';
import { isLoggedIn } from '../../utils/auth';
import LobbyChat from './LobbyChat';

const Lobby: React.FunctionComponent<LobbyProps> = (props) => {
  const {
    match: {
      params: { lobbyId },
    },
  } = props;

  const lobbyWrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  };

  const lobbyBodyStyles: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1,
  };

  // connect to lobbies Namespace
  const socket = useSocketNamespace('/lobbies');

  useEffect(() => {
    // connect to lobby room
    if (socket) {
      socket.emit('joinLobby', { lobbyId, token: isLoggedIn() });
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, lobbyId]);

  const renderLobby = () => {
    return (
      <section style={lobbyWrapperStyles}>
        <div style={lobbyBodyStyles}>Lobby</div>
        <LobbyChat lobbyId={lobbyId} socket={socket} />
      </section>
    );
  };

  return renderLobby();
};

export default withRouter(Lobby);
