import { Card } from '../../../../App/types';

export interface PlayerZoneProps {
  card: Card | null;
  slot:number;
  onCardClick: (cardId: number, index?:number) => void;
  onEmptyClick: (num:number) => void;
  onCardHover: (card: Card) => void;
}
