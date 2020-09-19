import { GameState } from '../../../../components/GameScreen/types';
import { Card } from '../../../../App/types';

export interface BoardProps {
  gameState: GameState;
  playerNumber: number;
  hand: Card[];
}
