import { HasSocket } from '../../../App/types';

export interface LobbyChatProps extends HasSocket {
  lobbyId: number;
}

export interface ChatMessage {
  username: string;
  message: string;
}
