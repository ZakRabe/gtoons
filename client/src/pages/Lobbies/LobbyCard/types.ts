import { HasRouter } from '../../../App/types';

export interface LobbyCardProps extends HasRouter {
  id: number;
  name: string;
  created: string;
  capacity: number;
  connectedCount: number;
  owner: any;
  game: any;
}
