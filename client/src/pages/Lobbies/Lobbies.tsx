import * as React from 'react';
import { Button, Card, Header } from 'semantic-ui-react';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { LobbiesProps } from './types';
import Lobby from './Lobby/Lobby';
import { isLoggedIn } from '../../utils/auth';
import { useSocketNamespace } from '../../utils/hooks';

export const Lobbies = (props: LobbiesProps) => {
  const lobbiesSocket = useSocketNamespace('/lobbies');

  const [isOpen, setOpen] = React.useState(false);
  const [lobbies, setLobbies] = React.useState<any[]>([]);

  React.useEffect(() => {
    // connect to lobbies namespace socket
    if (!lobbiesSocket) {
      return;
    }
    lobbiesSocket.emit('getOpenLobbies');
    lobbiesSocket.on('lobbyList', (data: any) => {
      setLobbies(data);
    });
    lobbiesSocket.on('lobbyCreated', (newLobby: any) => {
      setLobbies((prevLobbies) => [...prevLobbies, newLobby]);
    });
    lobbiesSocket.on('roomMessage', console.log);
  }, [lobbiesSocket]);

  const createLobby = () => {
    lobbiesSocket.emit('createLobby', { user: isLoggedIn(), deck: 1 });
  };

  return (
    <>
      <Header as="h1">Play gToons Revived</Header>
      <Button onClick={createLobby}>Create a Lobby</Button>
      <Header as="h2">Active Lobbies</Header>

      <Card.Group>
        {lobbies.map((lobby: any) => {
          return (
            <Lobby
              key={lobby.id}
              {...lobby}
              lobbiesSocket={lobbiesSocket}
            ></Lobby>
          );
        })}
      </Card.Group>
    </>
  );
};

export default Lobbies;
