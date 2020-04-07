import { Card } from '../../App/types';

export interface CardProps {
  model: Card;
  onClick?: (e: React.MouseEvent) => void;
  onHover?: (e: React.MouseEvent) => void;
  width: number;
  height: number;
}
