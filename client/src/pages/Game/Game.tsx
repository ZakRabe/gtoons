import * as React from 'react';
import Board from './components/Board';
import Info from './components/Info';
import CSS from 'csstype';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';

const styles: CSS.Properties = {
  display: 'flex',
  height: '100%',
  width: '100%',
};

class Game extends React.Component<{}, {}> {
  player1Name = 'Player 1';
  player2Name = 'Player 2';

  render() {
    return (
      <section style={styles}>
        <Board />
        <Info player1Name={this.player1Name} player2Name={this.player2Name} />
      </section>
    );
  }
}

export default socketConnect(Game);
