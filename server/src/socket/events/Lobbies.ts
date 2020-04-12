import LobbiesController from '../controller/LobbiesController';
import { SocketConfig } from '../../types';

const socketConfigs: SocketConfig[] = [
  {
    event: 'getOpenLobbies',
    controller: LobbiesController,
    action: 'getOpenLobbies',
  },
  {
    event: 'createLobby',
    controller: LobbiesController,
    action: 'createLobby',
  },
];

export default socketConfigs;
