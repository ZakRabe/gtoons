import { HasRouter } from '../../App/types';

export interface LobbyProps extends HasRouter {}

export interface Seat {
  user: any;
  ready: boolean;
}
