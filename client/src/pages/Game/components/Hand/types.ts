import { Card } from '../../../../App/types';

export interface HandProps {
  cards?: (Card|null)[];
  isOpponent?: boolean;
  onCardClick:(cardId:number, num:number)=>void;
  onEmptyClick:(num:number)=>void;
}
