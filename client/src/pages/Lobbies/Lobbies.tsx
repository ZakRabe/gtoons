import * as React from 'react';
import { Button, Card, Header } from 'semantic-ui-react';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { LobbiesProps } from './types';
import Lobby from './Lobby/Lobby';
import { isLoggedIn } from '../../utils/auth';

export const Lobbies = (props: LobbiesProps) => {
  const { socket } = props;

  const [isOpen, setOpen] = React.useState(false);
  const [lobbies, setLobbies] = React.useState<any[]>([]);

  React.useEffect(() => {
    socket.emit('getOpenLobbies');
    socket.on('lobbyList', (data: any) => {
      setLobbies(data);
    });
    socket.on('lobbyCreated', (newLobby: any) => {
      setLobbies((prevLobbies) => [...prevLobbies, newLobby]);
    });
  }, []);

  const createLobby = () => {
    socket.emit('createLobby', { user: isLoggedIn(), deck: 1 });
  };

  return (
    <>
      <Header as="h1">Play gToons Revived</Header>
      <Button onClick={createLobby}>Create a Lobby</Button>
      <Header as="h2">Active Lobbies</Header>

      <Card.Group>
        {lobbies.map((lobby: any) => {
          return <Lobby {...lobby}></Lobby>;
        })}
      </Card.Group>
    </>
  );
};

export default socketConnect(Lobbies);
