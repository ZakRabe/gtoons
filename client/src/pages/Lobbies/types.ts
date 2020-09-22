import { HasSocket, HasRouter } from '../../App/types';

export interface LobbiesProps
  extends HasSocket,
    HasRouter<{ lobbyId: string }> {}

export interface SVGBackgrounProps {
  dataURI: string;
  width?: number;
  height?: number;
}
