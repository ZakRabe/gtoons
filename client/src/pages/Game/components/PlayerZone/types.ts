import { Card } from '../../../../App/types';

export interface PlayerZoneProps {
  card: Card | null;
  onCardClick: (cardId: number) => void;
}
