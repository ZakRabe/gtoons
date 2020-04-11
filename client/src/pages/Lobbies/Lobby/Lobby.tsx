import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { LobbyProps } from './types';

const Lobby: React.FunctionComponent<LobbyProps> = (props) => {
  const { id, player1, player2 } = props;
  const renderLobby = () => {
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
            <Button basic color="purple">
              Spectate
            </Button>
            <Button disabled={player2} basic color="green">
              Join
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  };

  return renderLobby();
};

export default Lobby;
