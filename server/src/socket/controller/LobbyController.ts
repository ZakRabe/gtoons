import { getRepository, MoreThan } from 'typeorm';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { verifyToken } from '../../util';
import { SockerController } from './SocketController';

// TODO: ALL THIS LOGIC IS ACTUALLY FOR LOBBIES, Remove GAME stuff. lobbies are different
export class LobbyController extends SockerController {
  private gameRepository = getRepository(Game);
  private lobbyRepository = getRepository(Lobby);
  // private userRepository = getRepository(User);

  joinLobby({ lobbyId, token }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    const user = verifyToken(token);
    this.socket.join(lobbyRoom);
    this.io.to(lobbyRoom).emit('userJoined', user.username);
  }

  messageLobby({ token, message, lobbyId }) {
    const { username } = verifyToken(token);
    this.io.to(`lobby/${lobbyId}`).emit('newMessage', {
      username,
      message,
    });
  }
}

export default LobbyController;
