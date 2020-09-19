import {
  Button,
  InlineNotification,
  Select,
  SelectItem,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Deck } from '../../App/types';
import UserContext from '../../contexts/UserContext';
import { request } from '../../utils/api';
import { isLoggedIn } from '../../utils/auth';
import { useSocketNamespace } from '../../utils/hooks';
import LobbyChat from './LobbyChat';
import { LobbyProps, Seat } from './types';
import GameScreen from '../../components/GameScreen/GameScreen';

const emptySeat = { user: null, ready: false };

const Lobby: React.FunctionComponent<LobbyProps> = (props) => {
  const {
    match: {
      params: { lobbyId },
    },
    history,
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
    maxWidth: '50%',
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
    padding: 10,
  };

  const username = { fontSize: '2rem', lineHeight: '2rem', margin: 15 };

  const [lobby, setLobby] = useState<any>(null);
  const [seat1, setSeat1] = useState<Seat>(emptySeat);
  const [seat2, setSeat2] = useState<Seat>(emptySeat);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  // connect to lobbies Namespace
  const socket = useSocketNamespace('/lobbies');

  const loadDecks = () => {
    request({ url: '/deckBuilder/myDeckList' }).then((myDecks) =>
      setDecks(myDecks.filter((deck: Deck) => deck.cards.length === 12))
    );
  };
  useEffect(() => {
    loadDecks();
  }, []);

  useEffect(() => {
    // connect to lobby room
    if (!socket) {
      return;
    }
    socket.emit('joinLobby', { lobbyId, token: isLoggedIn() });
    socket.on('lobbyJoined', (lobbyModel: any) => {
      if (!lobbyModel) {
        history.push('/lobbies');
        return;
      }
      setLobby(lobbyModel);
      setSeat1({ user: lobbyModel.seat1, ready: lobbyModel.seat1Ready });
      setSeat2({ user: lobbyModel.seat2, ready: lobbyModel.seat2Ready });
    });
    socket.on('seat1Taken', (user: any) => setSeat1({ user, ready: false }));
    socket.on('seat2Taken', (user: any) => setSeat2({ user, ready: false }));
    socket.on('seat1Empty', () => setSeat1(emptySeat));
    socket.on('seat2Empty', () => setSeat2(emptySeat));
    socket.on('seat1Ready', () =>
      setSeat1((prevSeat) => ({ ...prevSeat, ready: true }))
    );
    socket.on('seat2Ready', () =>
      setSeat2((prevSeat) => ({ ...prevSeat, ready: true }))
    );
    socket.on('seat1Unready', () =>
      setSeat1((prevSeat) => ({ ...prevSeat, ready: false }))
    );
    socket.on('seat2Unready', () =>
      setSeat2((prevSeat) => ({ ...prevSeat, ready: false }))
    );
    socket.on('lobbyUpdated', (newLobby: any) => {
      console.log(newLobby);
      setLobby(newLobby);
    });

    return () => {
      if (socket) {
        socket.off('lobbyJoined');
        socket.off('seat1Taken');
        socket.off('seat1Empty');
        socket.off('seat1Ready');
        socket.off('seat1Unready');
        socket.off('seat2Taken');
        socket.off('seat2Empty');
        socket.off('seat2Ready');
        socket.off('seat2Unready');
        socket.off('lobbyUpdated');
      }
    };
  }, [socket, lobbyId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    return () => {
      if (socket) {
        socket.emit('leaveLobby', {
          lobbyId,
          token: isLoggedIn(),
        });
      }
    };
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
    socket.emit('ready', {
      token: isLoggedIn(),
      seatNumber,
      lobbyId,
      deck: selectedDeck,
    });
  };

  const unready = (seatNumber: number) => () => {
    socket.emit('unready', { token: isLoggedIn(), seatNumber, lobbyId });
  };

  const isCurrentUser = (currentUser: any, userInSeat: any) => {
    return userInSeat && currentUser && currentUser.userId === userInSeat.id;
  };

  const renderSeat = (seatNumber: number, user: any) => {
    const seat = seatNumber === 1 ? seat1 : seat2;
    const otherSeat = seatNumber === 1 ? seat2 : seat1;

    const hasValidDecks = !!decks.length;

    const buttonIconStyles = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: ' center',
    };

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
          {isCurrentUser(user, seat.user) && (
            <>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Select
                    labelText="Deck"
                    disabled={seat.ready}
                    onChange={(e) => {
                      const newDeck = decks.find(
                        (item) => item.id === Number(e.target.value)
                      );
                      setSelectedDeck(newDeck || null);
                    }}
                    //@ts-ignore
                    value={selectedDeck && selectedDeck.id}
                    id={`seat${seatNumber}-deckSelect`}
                  >
                    <SelectItem text="Choose a deck" value={null}></SelectItem>
                    {!hasValidDecks ? (
                      <SelectItem text="No legal decks!" disabled value={-1} />
                    ) : (
                      decks.map((deck: Deck) => (
                        <SelectItem
                          text={deck.name}
                          key={deck.id}
                          selected={
                            !!selectedDeck && selectedDeck.id === deck.id
                          }
                          value={deck.id}
                        ></SelectItem>
                      ))
                    )}
                  </Select>
                  <Button
                    size="field"
                    kind="secondary"
                    iconDescription="Reload decks"
                    onClick={loadDecks}
                    renderIcon={() => (
                      <i
                        className="fas fa-sync bx--btn__icon"
                        style={buttonIconStyles}
                      ></i>
                    )}
                  >
                    Reload Decks
                  </Button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className={`lobbyActions--btn-set`}>
                      <Button
                        renderIcon={() => (
                          <i
                            className="fas fa-times bx--btn__icon"
                            style={buttonIconStyles}
                          ></i>
                        )}
                        kind="danger"
                        size="field"
                        onClick={leaveSeat(seatNumber)}
                      >
                        Leave Seat
                      </Button>

                      <Button
                        renderIcon={
                          seat.ready
                            ? () => (
                                <i
                                  className="far fa-check-circle bx--btn__icon"
                                  style={buttonIconStyles}
                                ></i>
                              )
                            : () => (
                                <i
                                  className="far fa-circle bx--btn__icon"
                                  style={buttonIconStyles}
                                ></i>
                              )
                        }
                        kind="primary"
                        size="field"
                        disabled={!selectedDeck}
                        onClick={
                          seat.ready ? unready(seatNumber) : ready(seatNumber)
                        }
                      >
                        Ready
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {!hasValidDecks && (
                <InlineNotification
                  title="No decks"
                  subtitle={'Check the Deck Builder to fix this'}
                  kind="error"
                />
              )}
            </>
          )}
        </div>
      </section>
    );
  };
  const startGame = () => {
    socket.emit('startGame', { token: isLoggedIn(), lobbyId });
  };

  const isUserInSeat = (userId: number) => {
    const isSeat1 = seat1.user && seat1.user.id === userId;
    const isSeat2 = seat2.user && seat2.user.id === userId;

    return isSeat1 || isSeat2;
  };

  const renderStart = (user: any) => {
    if (!isUserInSeat(user.userId)) {
      return null;
    }
    return (
      <Button
        color="primary"
        disabled={!seat1.ready || !seat2.ready}
        onClick={startGame}
      >
        Start!
      </Button>
    );
  };

  const renderLobby = (user: any) => {
    if (!user) {
      return null;
    }
    return (
      <section style={lobbyWrapperStyles}>
        <div style={lobbyBodyStyles}>
          <section
            style={{ flexDirection: 'row', display: 'flex', flex: '1 0 auto' }}
          >
            {lobby.game ? (
              <GameScreen game={lobby.game} />
            ) : (
              <>
                {renderSeat(1, user)}
                {renderStart(user)}
                {renderSeat(2, user)}
              </>
            )}
          </section>
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
