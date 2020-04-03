import * as React from 'react';
import CSS from 'csstype';
import ColorTracker from '../ColorTracker';
import { ScoreZoneProps } from './types';

const styles: CSS.Properties = {
  display: 'inline-block',
  width: '48%',
  height: '96%',
  marginTop: '5px',
  marginBottom: '5px',
  marginLeft: '5px',
  backgroundColor: 'pink'
};

const scoreStyle: CSS.Properties = {
  height: '73%'
};

const playerNameStyles: CSS.Properties = {
  textAlign: 'center'
};

const score: CSS.Properties = {
  fontSize: '75px',
  textAlign: 'center',
  margin: '0'
};

export default class ScoreZone extends React.Component<ScoreZoneProps, {}> {
  render() {
    const { playerName } = this.props;

    return (
      <div style={styles}>
        <div style={scoreStyle}>
          <p style={playerNameStyles}>{playerName}</p>
          <p style={score}>50</p>
        </div>
        <ColorTracker />
      </div>
    );
  }
}
