import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, Image, Label } from 'semantic-ui-react';
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

  const openStatus = { fontSize: '1.2rem', margin: 0 };

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
          <div className="ui two buttons">
            <Button
              basic
              disabled={!openSeats}
              onClick={() => joinLobby()}
              color="green"
            >
              {!openSeats ? 'Lobby Full' : 'Join'}
            </Button>
          </div>

          <Card.Meta textAlign="right">created: {ago}</Card.Meta>
        </Card.Content>
        {openSeats ? (
          <Label color="teal" style={openStatus}>
            <i className="fas fa-door-open"></i>&nbsp;
            {openSeats} slot{openSeats !== 1 && 's'} available
          </Label>
        ) : (
          <Label color="red" style={openStatus}>
            <i className="fas fa-door-closed"></i>&nbsp; Lobby Full
          </Label>
        )}
      </Card>
    );
  };

  return renderLobby();
};

export default withRouter(LobbyCard);
