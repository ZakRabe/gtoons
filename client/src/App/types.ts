import { RouteComponentProps } from 'react-router-dom';

export interface HasSocket {
  socket: any;
}
export interface HasRouter<P = Partial<any>> extends RouteComponentProps<P> {}

export interface HasCaptcha {
  googleReCaptchaProps: any;
}

export interface Card {
  id: number;
  title: string;
  character: string;
  colors: string[];
  disabled?: boolean;
  description: string;
  rarity: string;
  groups: string[];
  types: string[];
  points: number;
  basePoints: number;
  modifiers: any[];
}

export interface Deck {
  id: number;
  player_id: number;
  name: string;
  cards: number[];
  face: number;
}
