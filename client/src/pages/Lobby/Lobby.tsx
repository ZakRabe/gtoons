import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSocketNamespace } from '../../utils/hooks';
import { LobbyProps } from './types';
import { isLoggedIn } from '../../utils/auth';
import LobbyChat from './LobbyChat';
import { Button } from 'semantic-ui-react';

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
    flexDirection: 'column',
  };

  const seatWrapperStyles: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
  };

  const seatCard: React.CSSProperties = {
    margin: 50,
    flex: 1,
    borderRadius: 16,
    background: 'white',
    padding: '2rem',
    textAlign: 'center',
  };

  const seatButton: React.CSSProperties = {
    fontSize: '5rem',
    cursor: 'pointer',
  };

  const username = { fontSize: '2rem' };

  const [lobby, setLobby] = useState<any>(null);
  const [seat1, setSeat1] = useState<any>(null);
  const [seat2, setSeat2] = useState<any>(null);

  // connect to lobbies Namespace
  const socket = useSocketNamespace('/lobbies');

  useEffect(() => {
    // connect to lobby room
    if (socket) {
      socket.emit('joinLobby', { lobbyId, token: isLoggedIn() });
      socket.on('lobbyJoined', (lobbyModel: any) => {
        setLobby(lobbyModel);
        setSeat1(lobbyModel.seat1);
        setSeat2(lobbyModel.seat2);
      });
      socket.on('seat1Taken', setSeat1);
      socket.on('seat1Empty', () => setSeat1(null));
      socket.on('seat2Taken', setSeat2);
      socket.on('seat2Empty', () => setSeat2(null));
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, lobbyId]);

  const takeSeat = (seatNumber: number) => () => {
    socket.emit('sitDown', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const renderLobby = () => {
    return (
      <section style={lobbyWrapperStyles}>
        <div style={lobbyBodyStyles}>
          <section style={{ flex: 1, flexDirection: 'row', display: 'flex' }}>
            <section style={seatWrapperStyles}>
              <div style={seatCard}>
                <Button
                  style={seatButton}
                  disabled={!!seat1}
                  onClick={takeSeat(1)}
                >
                  <i className="fas fa-chair"></i>
                </Button>
                <div style={username}>{seat1 && seat1.username}</div>
              </div>
            </section>
            <section style={seatWrapperStyles}>
              <div style={seatCard}>
                <Button
                  style={seatButton}
                  disabled={!!seat2}
                  onClick={takeSeat(2)}
                >
                  <i className="fas fa-chair"></i>
                </Button>
                <div style={username}>{seat2 && seat2.username}</div>
              </div>
            </section>
          </section>
          <section>Players List</section>
        </div>

        <LobbyChat lobbyId={lobbyId} socket={socket} />
      </section>
    );
  };

  return lobby ? renderLobby() : null;
};

export default withRouter(Lobby);
