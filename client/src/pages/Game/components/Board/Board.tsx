import * as React from 'react';
import CSS from 'csstype';
import PlayerZones from '../PlayerZones';
import { BoardProps } from './types';
import { request } from '../../../../utils/api';
import HandZone from '../HandZone';
import Hand from '../Hand';
import { Button } from 'semantic-ui-react';

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: 'teal',
};

const Board: React.FunctionComponent<BoardProps> = (props) => {
  const { gameState, playerNumber, hand,board,opponentBoard, onSubmit,onHandCardClick,onHandEmptyClick,onBoardCardClick,onBoardEmptyClick } = props;
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

  


  const render = () => {
    return (
      <section style={styles}>
        {isSpectator && <Hand cards={[]} 
        onCardClick={()=>{}}
        onEmptyClick={()=>{}}/>}
        <PlayerZones
          board={opponentBoard}
          isOpponent={true}
          onCardClick={()=>{}}
          onEmptyClick={()=>{}}
          onCardHover={()=>{}}
        />
        <Button 
        onClick={onSubmit}>Lock In</Button>
        <PlayerZones
          board={board}
          hand={hand} 
          onCardClick={onBoardCardClick}
          onEmptyClick={onBoardEmptyClick}
          onCardHover={()=>{}}
        />
        <Hand 
        cards={hand} 
        onCardClick={onHandCardClick}
        onEmptyClick={onHandEmptyClick}/>
      </section>
    );
  };

  return render();
};

export default Board;
