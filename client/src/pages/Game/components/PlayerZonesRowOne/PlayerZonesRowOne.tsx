import * as React from 'react';
import CSS from 'csstype';
import PlayerZone from '../PlayerZone';

const styles: CSS.Properties = {
  display:'inline-block',
  position:'relative',
  width:'100%',
  height:'50%',
  backgroundColor:'orange'
}

export default class PlayerZonesRowOne extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <PlayerZone />
        <PlayerZone />
        <PlayerZone />
        <PlayerZone />
      </div>
    );
  }
}
