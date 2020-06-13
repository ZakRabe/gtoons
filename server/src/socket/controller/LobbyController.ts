import { getRepository, MoreThan } from 'typeorm';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { verifyToken } from '../../util';
import { SockerController } from './SocketController';
import { disconnect } from 'cluster';
import { AuthTokenUser } from '../../types';

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
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    // trying to join a lobby that has closed
    if (!lobby) {
      // client looks for this, and redirects to the lobbies list
      this.socket.emit('lobbyJoined', null);
      return;
    }
    this.socket.join(lobbyRoom);

    this.io.to(lobbyRoom).emit('userJoined', user.username);
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
    let user: AuthTokenUser;
    try {
      user = verifyToken(token);
    } catch (error) {
      return;
    }

    this.socket.leave(lobbyRoom);
    const lobby = await this.lobbyRepository.findOne(lobbyId);
    // shouldn't happen, but just to be safe
    if (!lobby) {
      return;
    }
    lobby.connectedCount -= 1;

    // if user was in a seat, stand them up
    let seatToEmpty = 0;
    if (lobby.seat1 && lobby.seat1.id === user.userId) {
      seatToEmpty = 1;
    }
    if (lobby.seat2 && lobby.seat2.id === user.userId) {
      seatToEmpty = 2;
    }

    if (seatToEmpty > 0) {
      await this.standUp({ lobbyId, token, seatNumber: seatToEmpty });
    }

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
    let tokenUser;
    try {
      tokenUser = verifyToken(token);
    } catch (error) {
      return;
    }
    const { userId } = tokenUser;
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

  async ready({ token, seatNumber, lobbyId, deck }) {
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

      // TODO: Validate deck selection
      // deck belongs to user?
      // cards in deck are in user's collection
      // Dont allow users to modify a deck if its currently locked in a lobby, or a game
      lobby[`${playerField}Deck`] = deck.id;
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
