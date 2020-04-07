import * as React from 'react';
import CSS from 'csstype';
import PlayerZones from '../PlayerZones';

const styles: CSS.Properties = {
  display: 'inline-block',
  position: 'relative',
  width: '75%',
  height: '100%',
  backgroundColor: 'teal',
};

export default class Board extends React.Component<{}, {}> {
  render() {
    return (
      <section style={styles}>
        <PlayerZones isOpponent={true} />
        <PlayerZones />
      </section>
    );
  }
}
