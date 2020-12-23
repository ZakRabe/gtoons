import { Card } from '../../../../App/types';

export interface HandZoneProps {
  card: Card|null;
  slot:number;
  isOpponent?: boolean;
  onCardClick:(cardId:number, num:number)=>void;
  onEmptyClick:(num:number)=>void;
}
