import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { LobbyCardProps } from './types';
import { Button, Tile } from 'carbon-components-react';

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
      <Tile key={id}>
        <h2>{name}</h2>
        <p>Host: {owner.username}</p>
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
        <div>
          {openSeats ? (
            <label color="teal" style={openStatus}>
              <i className="fas fa-door-open"></i>&nbsp;
              {openSeats} slot{openSeats !== 1 && 's'} available
            </label>
          ) : (
            <label color="red" style={openStatus}>
              <i className="fas fa-door-closed"></i>&nbsp; Lobby Full
            </label>
          )}
        </div>
      </Tile>
    );
  };

  return renderLobby();
};

export default withRouter(LobbyCard);
