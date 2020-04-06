import * as React from 'react';
import CSS from 'csstype';
import ScoreZone from '../ScoreZone';
import { ScoreProps } from './types';

const styles: CSS.Properties = {
  display: 'block',
  width: '100%',
  height: '30%',
  backgroundColor: 'purple',
};

export default class Score extends React.Component<ScoreProps, {}> {
  render() {
    const { player1Name, player2Name } = this.props;
    return (
      <div style={styles}>
        <ScoreZone playerName={player1Name} />
        <ScoreZone playerName={player2Name} />
      </div>
    );
  }
}
