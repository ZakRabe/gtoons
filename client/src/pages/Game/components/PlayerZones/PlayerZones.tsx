import * as React from 'react';
import CSS from 'csstype';
import PlayerZonesRowOne from '../PlayerZonesRowOne';
import PlayerZonesRowTwo from '../PlayerZonesRowTwo';
import { PlayerZonesProps } from './types';

const styles: CSS.Properties = {
  display: 'block',
  position: 'relative',
  width: '100%',
  height: '49%',
  marginTop: '5px',
  marginBottom: '5px',
  backgroundColor: 'lightgreen',
};

export default class PlayerZones extends React.Component<PlayerZonesProps, {}> {
  render() {
    const { isOpponent } = this.props;

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
          <PlayerZonesRowOne />
          <PlayerZonesRowTwo />
        </div>
      </div>
    );
  }
}
