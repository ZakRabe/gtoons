import { RouteComponentProps } from 'react-router-dom';

export interface HasSocket {
  socket: any;
}
export interface HasRouter<P = Partial<any>> extends RouteComponentProps<P> {}

export interface Card {
  id: number;
  title: string;
  character: string;
  colors: string[];
  description: string;
  rarity: string;
  groups: string[];
  types: string[];
  points: number;
}

export interface Deck {
  id: number;
  player_id: number;
  name: string;
  cards: string;
  face: number;
}
