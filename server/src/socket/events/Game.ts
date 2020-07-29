import { SocketConfig } from '../../types';
import GameController from '../controller/GameController';

const socketConfigs: SocketConfig[] = [
  {
    event: 'playerConnected',
    controller: GameController,
    action: 'playerConnected',
  },
];

export default socketConfigs;
