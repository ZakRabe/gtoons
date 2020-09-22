import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { LobbyCardProps } from './types';
import {
  ButtonStylesActive,
  ButtonStylesDisabled,
  HeaderColor,
  InfoTitleColor,
  InfoDetailColor,
  TileStyles,
  TileHeadStyles,
  SubtitleColor,
} from './styles';
import { Button, Tile } from 'carbon-components-react';
import { ArrowRight32, Error32 } from '@carbon/icons-react';

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
      <Tile key={id} style={TileStyles}>
        <div style={TileHeadStyles}>
          <h2 style={{ color: HeaderColor }}>{name}</h2>
          <p style={{ color: SubtitleColor }}>Host: {owner.username}</p>
          <div style={{ color: InfoTitleColor }}>
            Game State stuff coming soon...
          </div>
        </div>
        <Button
          secondary
          disabled={!openSeats}
          onClick={joinLobby}
          style={!openSeats ? ButtonStylesDisabled : ButtonStylesActive}
          renderIcon={!openSeats ? Error32 : ArrowRight32}
        >
          {!openSeats ? 'Lobby is Full' : 'Join'}
        </Button>
      </Tile>
    );
  };

  return renderLobby();
};

export default withRouter(LobbyCard);
