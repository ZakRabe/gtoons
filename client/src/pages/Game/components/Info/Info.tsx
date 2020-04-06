import * as React from 'react';
import CSS from 'csstype';
import Score from '../Score';
import Hand from '../Hand';
import { InfoProps, InfoState } from './types';

const styles: CSS.Properties = {
  display: 'inline-block',
  position: 'relative',
  width: '25%',
  height: '100%',
  backgroundColor: 'green',
};

export default class Info extends React.Component<InfoProps, InfoState> {
  // mount
  // update
  // unmount

  render() {
    const { player1Name, player2Name } = this.props;

    return (
      <div style={styles}>
        <Score player1Name={player1Name} player2Name={player2Name} />
        <Hand />
      </div>
    );
  }
}
