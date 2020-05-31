import { getRepository, MoreThan } from 'typeorm';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { verifyToken } from '../../util';
import { SockerController } from './SocketController';
import { disconnect } from 'cluster';

// TODO: ALL THIS LOGIC IS ACTUALLY FOR LOBBIES
export class LobbyController extends SockerController {
  private gameRepository = getRepository(Game);
  private lobbyRepository = getRepository(Lobby);
  private userRepository = getRepository(User);

  onDisconnect = async ({ lobbyId, token }) => {
    await this.leaveLobby({ lobbyId, token });
  };

  async joinLobby({ lobbyId, token }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      return;
    }
    this.socket.join(lobbyRoom);

    this.io.to(lobbyRoom).emit('userJoined', user.username);
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    lobby.connectedCount += 1;
    await lobby.save();
    this.socket.on(
      'disconnect',
      async () => await this.onDisconnect({ lobbyId, token })
    );
    this.io.emit('lobbyUpdated', lobby.toJson());
    this.socket.emit('lobbyJoined', lobby.toJson());
  }

  async leaveLobby({ lobbyId, token }) {
    this.socket.off(
      'disconnect',
      async () => await this.onDisconnect({ lobbyId, token })
    );
    const lobbyRoom = `lobby/${lobbyId}`;
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      return;
    }

    this.socket.leave(lobbyRoom);
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    lobby.connectedCount -= 1;
    await lobby.save();
    this.io.emit('lobbyUpdated', lobby.toJson());
    this.io.to(lobbyRoom).emit('userLeft', user.username);
    this.socket.leave(lobbyRoom);
    if (lobby.connectedCount === 0) {
      await this.closeLobby({ lobbyId });
    }
  }

  messageLobby({ token, message, lobbyId }) {
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      return;
    }
    const { username } = user;
    this.io.to(`lobby/${lobbyId}`).emit('newMessage', {
      username,
      message,
    });
  }

  async sitDown({ token, seatNumber, lobbyId }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    let tokeUser;
    try {
      tokeUser = verifyToken(token);
    } catch (error) {
      return;
    }
    const { userId } = tokeUser;
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
    let tokenUser;
    try {
      tokenUser = verifyToken(token);
    } catch (error) {
      return;
    }
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    const user = await this.userRepository.findOne(tokenUser.userId);

    const field = seatNumber === 1 ? 'seat1' : 'seat2';

    if (lobby[field] && lobby[field].id === user.id) {
      lobby[field] = null;
      lobby[`${field}Ready`] = 0;
      await lobby.save();
      this.io.to(lobbyRoom).emit(`${field}Empty`);
    }
  }

  async ready({ token, seatNumber, lobbyId }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    let tokenUser;
    try {
      tokenUser = verifyToken(token);
    } catch (error) {
      return;
    }
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    const user = await this.userRepository.findOne(tokenUser.userId);

    const playerField = seatNumber === 1 ? 'seat1' : 'seat2';
    const field = seatNumber === 1 ? 'seat1Ready' : 'seat2Ready';

    if (lobby[playerField] && lobby[playerField].id === user.id) {
      lobby[field] = 1;
      await lobby.save();

      this.io.to(lobbyRoom).emit(`${playerField}Ready`);
    }
  }

  async unready({ token, seatNumber, lobbyId }) {
    const lobbyRoom = `lobby/${lobbyId}`;
    let tokenUser;
    try {
      tokenUser = verifyToken(token);
    } catch (error) {
      return;
    }
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    const user = await this.userRepository.findOne(tokenUser.userId);

    const playerField = seatNumber === 1 ? 'seat1' : 'seat2';
    const field = seatNumber === 1 ? 'seat1Ready' : 'seat2Ready';

    if (lobby[playerField] && lobby[playerField].id === user.id) {
      lobby[field] = 0;
      await lobby.save();
      this.io.to(lobbyRoom).emit(`${playerField}Unready`);
    }
  }

  async closeLobby({ lobbyId }) {
    const lobby = await this.lobbyRepository.findOne(lobbyId);

    if (lobby.connectedCount === 0) {
      await this.lobbyRepository.delete(lobbyId);
      this.io.emit('lobbyClosed', lobby.toJson().id);
    }
    this.socket.emit('cannotClose_notEmpty');
  }
}

export default LobbyController;
