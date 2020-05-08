import { Card } from '../../../../App/types';

export interface PlayerZonesProps {
  isOpponent?: boolean;
  cards?: (Card | null)[];
  onCardClick: (cardId: number) => void;
  onCardHover: (card: Card) => void;
}
