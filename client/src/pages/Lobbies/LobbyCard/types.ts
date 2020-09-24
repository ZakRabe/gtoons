import { CarbonIconType } from '@carbon/icons-react';
import { HasRouter } from '../../../App/types';

export interface LobbyCardProps extends HasRouter {
  id: number;
  name: string;
  created: string;
  capacity: number;
  connectedCount: number;
  owner: any;
  game: any;
  lobbyPic: string;
}

export interface LobbyCardDetailProps {
  Icon: CarbonIconType;
  title: string;
  content: string | number;
}
