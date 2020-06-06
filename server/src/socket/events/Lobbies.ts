import LobbiesController from '../controller/LobbiesController';
import LobbyController from '../controller/LobbyController';
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
  {
    event: 'joinLobby',
    controller: LobbyController,
    action: 'joinLobby',
  },
  {
    event: 'leaveLobby',
    controller: LobbyController,
    action: 'leaveLobby',
  },
  {
    event: 'messageLobby',
    controller: LobbyController,
    action: 'messageLobby',
  },
  {
    event: 'sitDown',
    controller: LobbyController,
    action: 'sitDown',
  },
  {
    event: 'standUp',
    controller: LobbyController,
    action: 'standUp',
  },
  {
    event: 'ready',
    controller: LobbyController,
    action: 'ready',
  },
  {
    event: 'unready',
    controller: LobbyController,
    action: 'unready',
  },
];

export default socketConfigs;
