import { SocketConfig } from '../../types';
import GameController from '../controller/GameController';

const socketConfigs: SocketConfig[] = [
  {
    event: 'playerConnected',
    controller: GameController,
    action: 'playerConnected',
  },
  {
    event: 'lockIn',
    controller: GameController,
    action: 'lockIn',
  },
  {
    event: 'discarding',
    controller: GameController,
    action: 'discarding',
  },
];

export default socketConfigs;
