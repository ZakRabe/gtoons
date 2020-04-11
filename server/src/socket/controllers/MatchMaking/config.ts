import { MatchMakingController } from './MatchMakingController';
import { SocketConfig } from '../../../types';

const socketConfigs: SocketConfig[] = [
  {
    event: 'getOpenLobbies',
    controller: MatchMakingController,
    action: 'getOpenLobbies',
  },
  {
    event: 'createLobby',
    controller: MatchMakingController,
    action: 'createLobby',
  },
];

export default socketConfigs;
