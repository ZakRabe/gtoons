import { Card } from '../../App/types';

export interface CardProps {
  model: Card|null;
  onClick?: (e: React.MouseEvent) => void;
  onEmptyClick?: (e:React.MouseEvent) => void;
  onHover?: (e: React.MouseEvent) => void;
  width: number;
  height: number;
}
