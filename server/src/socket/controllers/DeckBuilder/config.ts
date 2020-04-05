import { DeckBuilderController } from './DeckBuilderController';
import { SocketConfig } from '../../../types';

export const socketConfigs: SocketConfig[] = [
  {
    event: 'getCollection',
    controller: DeckBuilderController,
    action: 'getCollection'
  }
];

export default socketConfigs;