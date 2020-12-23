import { GameState } from '../../../../components/GameScreen/types';
import { Card } from '../../../../App/types';

export interface BoardProps {
  gameState: GameState;
  playerNumber: number;
  hand: (Card|null)[];
  board: (Card|null)[];
  opponentBoard: (Card|null)[];
  onSubmit:()=>void;
  onHandCardClick:(cardId:number, num:number) => void;
  onHandEmptyClick:(num:number) => void;
  onBoardCardClick:(cardId:number, index?:number) => void;
  onBoardEmptyClick:(num:number) => void;
}
