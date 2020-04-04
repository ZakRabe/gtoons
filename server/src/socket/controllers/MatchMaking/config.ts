import { MatchMakingController } from './MatchMakingController';
import { SocketConfig } from '../../../types';

const socketConfigs: SocketConfig[] = [
  {
    event: 'getOpenLobbies',
    controller: MatchMakingController,
    action: 'getOpenLobbies'
  }
];

export default socketConfigs;
