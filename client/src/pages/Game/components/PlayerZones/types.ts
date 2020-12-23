import { Card } from '../../../../App/types';

export interface PlayerZonesProps {
  isOpponent?: boolean;
  onCardClick: (cardId: number, index?:number) => void;
  onEmptyClick: (num:number)=> void;
  onCardHover: (card: Card) => void;
  hand?: (Card|null)[];
  board: (Card|null)[];
}
