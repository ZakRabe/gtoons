import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { LobbyCardProps, LobbyCardDetailProps } from './types';
import {
  ButtonStylesActive,
  ButtonStylesDisabled,
  LobbyDetailHeaderStyles,
  LobbyDetailContentStyles,
  TileStyles,
  TileHeadStyles,
  TileHeadCloseStyles,
  TileHeadCloseContainerStyles,
  TileBodyStyles,
  TileTitleStyles,
  TileSubtitleStyles,
  TilePictureStyles,
} from './styles';
import { Button, Tile } from 'carbon-components-react';
import {
  ArrowRight32,
  Close16,
  Error32,
  Events16,
  EventSchedule16,
  GameConsole16,
  Locked16,
} from '@carbon/icons-react';
import { TokyoCherryBlossom } from '@carbon/pictograms-react';

const LobbyDetail: React.FunctionComponent<LobbyCardDetailProps> = (props) => {
  const { Icon, title, content } = props;

  return (
    <div>
      <div style={LobbyDetailHeaderStyles}>
        <Icon
          style={{
            paddingRight: '0.125rem',
          }}
        />
        <div style={{ alignSelf: 'center' }}>{title.toUpperCase()}</div>
      </div>
      <div style={LobbyDetailContentStyles}>{content}</div>
    </div>
  );
};

export const LobbyCard: React.FunctionComponent<LobbyCardProps> = (props) => {
  const {
    id,
    name,
    created,
    capacity,
    owner,
    connectedCount,
    lobbyPic,
    game: _game,
  } = props;

  console.log(lobbyPic);

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
          {lobbyPic && lobbyPic !== '' ? (
            <img style={TilePictureStyles} src={lobbyPic} />
          ) : (
            <TokyoCherryBlossom
              style={{
                ...TilePictureStyles,
                backgroundColor: '#CCCCCC',
              }}
            />
          )}
          <div style={{ alignSelf: 'center' }}>
            <h2 style={TileTitleStyles}>
              {name /* Leaving h2 purely for ARIA tree */}
            </h2>
            <p style={TileSubtitleStyles}>Host: {owner.username}</p>
          </div>
          <div style={TileHeadCloseContainerStyles}>
            <Button
              hasIconOnly
              renderIcon={Close16}
              tooltipAlignment={'center'}
              tooltipPosition={'bottom'}
              iconDescription={'TBD'}
              style={TileHeadCloseStyles}
            />
          </div>
        </div>
        <div style={TileBodyStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <LobbyDetail
                Icon={EventSchedule16}
                title={'created'}
                content={ago}
              />
              <LobbyDetail
                Icon={Locked16}
                title={'password'}
                content={'Coming soon'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <LobbyDetail
                Icon={GameConsole16}
                title={'status'}
                content={'Coming soon'}
              />
              <LobbyDetail
                Icon={Events16}
                title={'Connected'}
                content={`${openSeats}/${connectedCount}`}
              />
            </div>
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
