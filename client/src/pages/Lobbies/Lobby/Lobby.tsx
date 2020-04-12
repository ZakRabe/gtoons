import React, { useEffect } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { LobbyProps } from './types';
import moment from 'moment';

const Lobby: React.FunctionComponent<LobbyProps> = (props) => {
  const {
    id,
    name,
    created,
    capacity,
    owner,
    connectedCount,
    game,
    lobbiesSocket,
  } = props;

  useEffect(() => {
    lobbiesSocket.on('connectToRoom', (data: any) => {
      console.log(data);
    });
  }, []);

  const renderLobby = () => {
    const ago = moment.duration(moment(created).diff(moment())).humanize(true);
    const openSeats = capacity - connectedCount;
    return (
      <Card key={id}>
        <Card.Content>
          <Image
            floated="left"
            size="mini"
            circular
            src="http://placehold.it/100x100"
          />
          <Card.Header>{name}</Card.Header>
          <Card.Meta>Host: {owner.username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          {openSeats} seat{openSeats > 1 && 's'} open
          <div className="ui two buttons">
            <Button basic disabled={capacity === connectedCount} color="green">
              {capacity === connectedCount ? 'Lobby Full' : 'Join'}
            </Button>
          </div>
          <Card.Meta textAlign="right">created: {ago}</Card.Meta>
        </Card.Content>
      </Card>
    );
  };

  return renderLobby();
};

export default Lobby;
