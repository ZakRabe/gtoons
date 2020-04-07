import * as React from 'react';
import {
  Button,
  Header,
  List,
  Image,
  Container,
  Card,
} from 'semantic-ui-react';
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
      setLobbies(data);
    });
  }, []);

  return (
    <>
      <Header as="h1">Play gToons Revived</Header>
      <Button>{isOpen ? 'Cancel' : 'Create a Lobby'}</Button>
      <Header as="h2">Active Lobbies</Header>

      <Card.Group>
        {lobbies.map((lobby: any) => {
          const { id, player1, player2 } = lobby;
          return (
            <Card key={id}>
              <Card.Content>
                <Image
                  floated="left"
                  size="mini"
                  circular
                  src="http://placehold.it/100x100"
                />
                <Card.Header>{player1.username}</Card.Header>
                <Card.Meta>created: 10 minutes ago</Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button disabled={player2} basic color="green">
                    Join
                  </Button>
                  <Button basic color="purple">
                    Spectate
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </>
  );
};

export default socketConnect(Lobby);
