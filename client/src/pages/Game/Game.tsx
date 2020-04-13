import * as React from 'react';

import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';

class Game extends React.Component<{}, {}> {
  player1Name = 'Player 1';
  player2Name = 'Player 2';

  render() {
    return <div className="ui grid container"></div>;
  }
}

export default socketConnect(Game);
