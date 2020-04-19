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
  private userRepository = getRepository(User);

  async joinLobby({ lobbyId, token }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    const user = verifyToken(token);
    this.socket.join(lobbyRoom);
    // TODO: Increment connectedCount
    this.io.to(lobbyRoom).emit('userJoined', user.username);
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    this.socket.emit('lobbyJoined', lobby.toJson());
  }

  messageLobby({ token, message, lobbyId }) {
    const { username } = verifyToken(token);
    this.io.to(`lobby/${lobbyId}`).emit('newMessage', {
      username,
      message,
    });
  }

  async sitDown({ token, seatNumber, lobbyId }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    const { userId } = verifyToken(token);
    const lobby = await this.lobbyRepository.findOne(lobbyId);

    const user = await this.userRepository.findOne(userId);

    const field = seatNumber === 1 ? 'seat1' : 'seat2';
    const otherField = seatNumber === 1 ? 'seat2' : 'seat1';
    if (
      lobby[field] === null &&
      !(lobby[otherField] && lobby[otherField].id == user.id)
    ) {
      lobby[field] = user;
      await lobby.save();
      this.io.to(lobbyRoom).emit(`${field}Taken`, user.toJson());
    }
  }
  async standUp({ token, seatNumber, lobbyId }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    const { userId } = verifyToken(token);
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    const user = await this.userRepository.findOne(userId);

    const field = seatNumber === 1 ? 'seat1' : 'seat2';

    if (lobby[field] && lobby[field].id === user.id) {
      lobby[field] = null;
      await lobby.save();
      this.io.to(lobbyRoom).emit(`${field}Empty`);
    }
  }
}

export default LobbyController;
