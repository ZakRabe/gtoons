import { Card } from '../../../../App/types';

export interface CardRowProps {
  // Changed cards? to card
  cards?: (Card | null)[];
  onCardClick: (cardId: number, index?:number) => void;
  onEmptyClick: (num:number) => void;
  onCardHover: (card: Card) => void;
}
