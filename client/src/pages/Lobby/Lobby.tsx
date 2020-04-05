import * as React from 'react';
import { Button, Header } from 'semantic-ui-react';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { LobbyProps } from './types';

export const Lobby = (props: LobbyProps) => {
  const { socket } = props;

  const [isOpen, setOpen] = React.useState(false);
  const [lobbies, setLobbies] = React.useState([]);

  React.useEffect(() => {
    socket.emit('getOpenLobbies');
    socket.on('lobbyList', (data: any) => {
      console.log(data);
      setLobbies(data);
    });
  }, []);

  return (
    <>
      <Header as="h1">Lobbies</Header>
      <Button>{isOpen ? 'Cancel' : 'Create a Lobby'}</Button>
      <ul>
        {lobbies.map((lobby: any) => {
          return (
            <li key={lobby.id}>
              #{lobby.id}: Started by Player: {lobby.player1}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default socketConnect(Lobby);
