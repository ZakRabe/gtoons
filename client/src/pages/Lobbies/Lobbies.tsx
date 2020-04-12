import * as React from 'react';
import { Button, Card, Header, Popup, Input, Divider } from 'semantic-ui-react';
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
  const minCapacity = 2;
  const maxCapacity = 30;

  const [lobbies, setLobbies] = React.useState<any[]>([]);
  const [lobbyName, setLobbyName] = React.useState('New Lobby');
  const [capacity, setCapacity] = React.useState('2');

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
    lobbiesSocket.emit('createLobby', {
      user: isLoggedIn(),
      name: lobbyName,
      capacity,
    });
  };

  const onNameChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const { value: newName } = e.target;
    setLobbyName(newName);
  };

  const onCapacityChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const { value: newCapacity } = e.target;
    if (newCapacity >= minCapacity && newCapacity <= maxCapacity) {
      setCapacity(newCapacity);
    }
  };

  const renderPopup = () => {
    return (
      <Popup on="click" wide trigger={<Button>Create a Lobby</Button>}>
        <Popup.Header>Lobby Settings</Popup.Header>
        <Popup.Content>
          <Input label="Name" value={lobbyName} onChange={onNameChange}></Input>
          <Input
            type="number"
            label="Room Size"
            value={capacity}
            onChange={onCapacityChange}
          ></Input>
          <Divider />
          <Button floated="right" onClick={() => createLobby()}>
            <i className="fas fa-play"></i>&nbsp; Go
          </Button>
        </Popup.Content>
      </Popup>
    );
  };

  return (
    <>
      <Header as="h1">Play gToons Revived</Header>
      {renderPopup()}
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
