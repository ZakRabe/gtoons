import * as React from 'react';
import { Button, Card, Divider, Header, Input, Popup } from 'semantic-ui-react';
import { isLoggedIn } from '../../utils/auth';
import { useSocketNamespace } from '../../utils/hooks';
import LobbyCard from './LobbyCard';
import { LobbiesProps } from './types';
import { useHistory } from 'react-router-dom';

export const Lobbies = (_props: LobbiesProps) => {
  const lobbiesSocket = useSocketNamespace('/lobbies');
  const { push } = useHistory();
  const minCapacity = 2;
  const maxCapacity = 30;

  const [lobbies, setLobbies] = React.useState<any[]>([]);
  const [lobbyName, setLobbyName] = React.useState('New Lobby');
  const [capacity, setCapacity] = React.useState('2');
  const [isOpen, setIsOpen] = React.useState(false);

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
      console.log('created:', newLobby.id);
      setLobbies((prevLobbies) => [...prevLobbies, newLobby]);
    });

    lobbiesSocket.on('lobbyCreateSuccess', (newLobbyId: number) => {
      setTimeout(() => {
        push(`/lobbies/${newLobbyId}`);
      }, 500);
    });

    lobbiesSocket.on('lobbyUpdated', (newLobby: any) => {
      setLobbies((prevLobbies) => [
        ...prevLobbies.filter((lobby) => lobby.id !== newLobby.id),
        newLobby,
      ]);
    });
    lobbiesSocket.on('lobbyClosed', (lobbyId: number) => {
      console.log('lobbyClosed', lobbyId);
      setLobbies((prevLobbies) => [
        ...prevLobbies.filter((lobby) => lobby.id !== lobbyId),
      ]);
    });
  }, [lobbiesSocket]);

  const createLobby = () => {
    lobbiesSocket.emit('createLobby', {
      user: isLoggedIn(),
      name: lobbyName,
      capacity: Number(capacity),
    });
    setIsOpen(false);
  };

  const onNameChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const { value: newName } = e.target;
    if (newName.length <= 50) {
      setLobbyName(newName);
    }
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
      <Popup
        on="click"
        wide
        trigger={<Button>Create a Lobby</Button>}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
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
          return <LobbyCard key={lobby.id} {...lobby}></LobbyCard>;
        })}
      </Card.Group>
    </>
  );
};

export default Lobbies;
