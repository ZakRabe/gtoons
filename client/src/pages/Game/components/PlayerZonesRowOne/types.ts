import { Card } from '../../../../App/types';

export interface CardRowProps {
  cards?: (Card | null)[];
  onCardClick: (cardId: number) => void;
  onCardHover: (card: Card) => void;
}
