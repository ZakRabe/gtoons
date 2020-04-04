import * as React from 'react';
import { LobbyProps } from './types';
import {
  socketConnect
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Button } from '@material-ui/core';

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
    <section>
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
    </section>
  );
};

export default socketConnect(Lobby);
