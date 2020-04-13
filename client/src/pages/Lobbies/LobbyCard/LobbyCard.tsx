import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import { LobbyCardProps } from './types';

export const LobbyCard: React.FunctionComponent<LobbyCardProps> = (props) => {
  const {
    id,
    name,
    created,
    capacity,
    owner,
    connectedCount,
    game: _game,
  } = props;

  const [, rerender] = useState(false);

  useEffect(() => {
    // auto-rerender every 1 minute, should update the "5 minutes ago"
    const interval = setInterval(() => {
      rerender((prev) => !prev);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const joinLobby = () => {
    const { history } = props;

    history.push(`/lobbies/${id}`);
  };

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
            <Button
              basic
              disabled={capacity === connectedCount}
              onClick={() => joinLobby()}
              color="green"
            >
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

export default withRouter(LobbyCard);
