import * as React from 'react';
import CSS from 'csstype';
import PlayerZonesRowOne from '../PlayerZonesRowOne';
import PlayerZonesRowTwo from '../PlayerZonesRowTwo';
import { PlayerZonesProps } from './types';

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  marginTop: '5px',
  marginBottom: '5px',
  backgroundColor: 'lightgreen',
};

export default class PlayerZones extends React.Component<PlayerZonesProps, {}> {
  render() {
    const { isOpponent,board, onCardClick,onEmptyClick, onCardHover, hand  } = this.props;

    const rowOne = board?.slice(0, 4);
    const rowTwo = board?.slice(4);

    const container: CSS.Properties = {
      width: '100%',
      height: '100%',
      backgroundColor: 'slateblue',
      display: 'flex',
      flexDirection: isOpponent ? 'column-reverse' : 'column',
    };

    return (
      <div style={styles}>
        <div style={container}>
          <PlayerZonesRowOne
            cards={rowOne}
            onCardClick={onCardClick}
            onEmptyClick={onEmptyClick}
            onCardHover={onCardHover}
          />
          <PlayerZonesRowTwo
            cards={rowTwo}
            onCardClick={onCardClick}
            onEmptyClick={onEmptyClick}
            onCardHover={onCardHover}
          />
        </div>
      </div>
    );
  }
}
