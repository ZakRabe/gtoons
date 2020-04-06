import { RouteComponentProps } from 'react-router-dom';

export interface HasSocket {
  socket: any;
}
export interface HasRouter extends RouteComponentProps {}

export interface Card {
  id: number;
  title: string;
  character: string;
  colors: string[];
  description: string;
  rarity: string;
  groups: string[];
  types: string[];
}
