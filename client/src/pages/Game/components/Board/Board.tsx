import * as React from 'react';
import CSS from 'csstype';
import PlayerZone from '../PlayerZone';

const styles: CSS.Properties = {
  display:'inline-block',
  position:'relative',
  width:'75%',
  height:'100%',
  backgroundColor:'teal'
}

export default class Board extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <PlayerZone />
        <PlayerZone />
      </div>
    );
  }
}
