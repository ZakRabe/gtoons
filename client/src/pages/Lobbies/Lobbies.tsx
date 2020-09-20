import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { isLoggedIn } from '../../utils/auth';
import { request } from '../../utils/api';
import { useSocketNamespace } from '../../utils/hooks';
import LobbyCard from './LobbyCard';
import './styles.ts';
import { LobbiesProps } from './types';
import {
  createLobby as createLobbyStyle,
  lobbieContent,
  newGame,
  newGameContent,
  newGameContentAction,
  profileContainer,
} from './styles';
import { useHistory } from 'react-router-dom';
import { Button, TextInput, TileGroup, Tooltip } from 'carbon-components-react';
import { Add16, PlayFilledAlt32 } from '@carbon/icons-react';
import { UserProfile } from '@carbon/pictograms-react';

const ProfileDisplay = () => {
  const [profilePic, setProfilePic] = useState<HTMLElement>();
  const { user } = useContext(UserContext);

  // Should I being using suspense here instead?
  useEffect(() => {
    request({
      url: `users/${user.userId}`,
    })
      .then((currentUser) => {
        const { profilePic } = currentUser;

        const dom = new DOMParser();
        const svg = dom.parseFromString(atob(profilePic), 'image/svg+xml');
        setProfilePic(svg.documentElement);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={profileContainer}>
      <div>
        <h4>Hola</h4>
        <h2>{user.username}</h2>
      </div>
      <div>{profilePic || <UserProfile />}</div>
    </div>
  );
};

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
    return () => {
      if (lobbiesSocket) {
        lobbiesSocket.off('lobbyList');
        lobbiesSocket.off('lobbyCreated');
        lobbiesSocket.off('lobbyCreateSuccess');
        lobbiesSocket.off('lobbyUpdated');
        lobbiesSocket.off('lobbyClosed');
      }
    };
  }, [lobbiesSocket]);

  const createLobby = () => {
    lobbiesSocket.emit('createLobby', {
      user: isLoggedIn(),
      name: lobbyName,
      capacity: Number(capacity),
    });
    setIsOpen(false);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: newName } = e.target;
    if (newName.length <= 50) {
      setLobbyName(newName);
    }
  };

  const onCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: newCapacity } = e.target;
    // @ts-ignore
    if (newCapacity >= minCapacity && newCapacity <= maxCapacity) {
      setCapacity(newCapacity);
    }
  };

  const onLobbyOpen = () => setIsOpen(!isOpen);

  const renderPopup = () => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          id={'createLobby'}
          style={createLobbyStyle}
          renderIcon={Add16}
          onClick={onLobbyOpen}
        >
          Create a lobby
        </Button>
        <Tooltip
          direction="bottom"
          open={isOpen}
          showIcon={false}
          triggerId={'createLobby'}
        >
          <h3>Lobby Settings</h3>
          <TextInput
            id="lobbyName"
            labelText="Name"
            value={lobbyName}
            onChange={onNameChange}
          />
          <TextInput
            id="roomSize"
            type="number"
            labelText="Room Size"
            value={capacity}
            onChange={onCapacityChange}
          />
          <Button
            hasIconOnly
            renderIcon={PlayFilledAlt32}
            tooltipAlignment={'center'}
            tooltipPosition="bottom"
            iconDescription="Go"
            style={{ float: 'right' }}
            onClick={() => createLobby()}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <>
      <div style={newGame}>
        <div style={newGameContent}>
          <div style={newGameContentAction}>
            <h2>Play reToons Revived</h2>
            {renderPopup()}
          </div>
          <ProfileDisplay />
        </div>
      </div>
      <div>
        <div style={lobbieContent}>
          <h3>Active Lobbies</h3>
          <TileGroup name="Lobbies">
            {lobbies.map((lobby: any) => {
              return <LobbyCard key={lobby.id} {...lobby}></LobbyCard>;
            })}
          </TileGroup>
        </div>
      </div>
    </>
  );
};

export default Lobbies;
