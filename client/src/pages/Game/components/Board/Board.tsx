import * as React from 'react';
import CSS from 'csstype';
import PlayerZones from '../PlayerZones';
import { BoardProps } from './types';
import { request } from '../../../../utils/api';

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: 'teal',
};

const Board: React.FunctionComponent<BoardProps> = (props) => {
  const { gameState, playerNumber } = props;
  const isSpectator = playerNumber === -1;

  const [p1Board, setP1Board] = React.useState([]);
  const [p2Board, setP2board] = React.useState([]);

  React.useEffect(() => {
    request({ url: '/cards/some', data: { cardIds: p1Board } }).then(
      setP1Board
    );
  }, [gameState.player1Board]);
  React.useEffect(() => {
    request({ url: '/cards/some', data: { cardIds: p2Board } }).then(
      setP2board
    );
  }, [gameState.player2Board]);

  let opponentBoard = p2Board;
  let myBoard = p1Board;
  if (playerNumber === 2) {
    opponentBoard = p1Board;
    myBoard = p2Board;
  }

  const render = () => {
    return (
      <section style={styles}>
        <PlayerZones
          cards={opponentBoard}
          isOpponent={true}
          onCardClick={() => {}}
          onCardHover={() => {}}
        />
        <PlayerZones
          cards={myBoard}
          onCardClick={() => {}}
          onCardHover={() => {}}
        />
      </section>
    );
  };

  return render();
};

export default Board;
