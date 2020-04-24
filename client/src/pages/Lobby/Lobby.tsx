import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSocketNamespace } from '../../utils/hooks';
import { LobbyProps, Seat } from './types';
import { isLoggedIn } from '../../utils/auth';
import LobbyChat from './LobbyChat';
import { Button } from 'semantic-ui-react';
import UserContext from '../../contexts/UserContext';
import { request } from '../../utils/api';

const emptySeat = { user: null, ready: false };

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

  const username = { fontSize: '2rem', lineHeight: '2rem', margin: 15 };

  const [lobby, setLobby] = useState<any>(null);
  const [seat1, setSeat1] = useState<Seat>(emptySeat);
  const [seat2, setSeat2] = useState<Seat>(emptySeat);
  const [decks, setDecks] = useState<any>([]);

  // connect to lobbies Namespace
  const socket = useSocketNamespace('/lobbies');

  useEffect(() => {
    request({ url: '/deckBuilder/myDeckList' }).then((myDecks) => {
      setDecks(myDecks.filter((deck: number[]) => deck.length === 12));
    });
  }, []);

  useEffect(() => {
    // connect to lobby room
    if (socket) {
      socket.emit('joinLobby', { lobbyId, token: isLoggedIn() });
      socket.on('lobbyJoined', (lobbyModel: any) => {
        console.log(lobbyModel);
        setLobby(lobbyModel);
        setSeat1({ user: lobbyModel.seat1, ready: lobbyModel.seat1Ready });
        setSeat2({ user: lobbyModel.seat2, ready: lobbyModel.seat2Ready });
      });
      socket.on('seat1Taken', (user: any) => setSeat1({ user, ready: false }));
      socket.on('seat1Empty', () => setSeat1(emptySeat));
      socket.on('seat1Ready', () =>
        setSeat1((prevSeat) => ({ ...prevSeat, ready: true }))
      );
      socket.on('seat1Unready', () =>
        setSeat1((prevSeat) => ({ ...prevSeat, ready: false }))
      );

      socket.on('seat2Taken', (user: any) => setSeat2({ user, ready: false }));
      socket.on('seat2Empty', () => setSeat2(emptySeat));
      socket.on('seat2Ready', () => {
        console.log('seat2');
        setSeat2((prevSeat) => ({ ...prevSeat, ready: true }));
      });
      socket.on('seat2Unready', () =>
        setSeat2((prevSeat) => ({ ...prevSeat, ready: false }))
      );

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, lobbyId]);

  const takeSeat = (seatNumber: number) => () => {
    if (!decks.length) {
    }
    socket.emit('sitDown', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const leaveSeat = (seatNumber: number) => () => {
    socket.emit('standUp', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const ready = (seatNumber: number) => () => {
    socket.emit('ready', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const unready = (seatNumber: number) => () => {
    socket.emit('unready', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const isCurrentUser = (currentUser: any, userInSeat: any) => {
    return userInSeat && currentUser.userId === userInSeat.id;
  };

  const renderSeat = (seatNumber: number, user: any) => {
    const seat = seatNumber === 1 ? seat1 : seat2;
    const otherSeat = seatNumber === 1 ? seat2 : seat1;
    return (
      <section style={seatWrapperStyles}>
        <div style={seatCard}>
          <Button
            style={seatButton}
            disabled={!!seat.user || isCurrentUser(user, otherSeat.user)}
            onClick={takeSeat(seatNumber)}
          >
            <i className="fas fa-chair"></i>
          </Button>
          <div style={username}>{seat.user && seat.user.username}</div>
          <div>
            {isCurrentUser(user, seat.user) && (
              <>
                <Button color="orange" onClick={leaveSeat(seatNumber)}>
                  <i className="fas fa-times"></i>&nbsp; Leave Seat
                </Button>
                <Button
                  color={seat.ready ? 'green' : 'yellow'}
                  onClick={seat.ready ? unready(seatNumber) : ready(seatNumber)}
                >
                  {seat.ready ? (
                    <i className="far fa-check-circle"></i>
                  ) : (
                    <i className="far fa-circle"></i>
                  )}
                  &nbsp; Ready
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderLobby = (user: any) => {
    return (
      <section style={lobbyWrapperStyles}>
        <div style={lobbyBodyStyles}>
          <section style={{ flexDirection: 'row', display: 'flex' }}>
            {renderSeat(1, user)}
            {renderSeat(2, user)}
          </section>
          <section>Players List</section>
        </div>

        <LobbyChat lobbyId={lobbyId} socket={socket} />
      </section>
    );
  };

  return lobby ? (
    <UserContext.Consumer>
      {({ user }) => {
        return renderLobby(user);
      }}
    </UserContext.Consumer>
  ) : null;
};

export default withRouter(Lobby);
