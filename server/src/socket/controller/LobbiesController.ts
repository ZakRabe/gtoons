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

  // TODO. dont need deck to create a lobby
  async createLobby({ user: token, name, capacity }) {
    let userId;
    try {
      userId = verifyToken(token).userId;
    } catch (error) {
      console.error('Invalid Auth Token');
      return;
    }

    const owner = await this.userRepository.findOne({
      id: userId,
    });
    const existingLobby = await this.lobbyRepository.find({
      where: {
        owner,
      },
    });
    // they are in an existing game, do nothing
    // TODO: return an error message for the client
    if (existingLobby.length) {
      return;
    }

    const newLobby = this.lobbyRepository.create({
      owner,
      name,
      capacity,
    });

    const savedLobby = await newLobby.save();
    await savedLobby.reload();

    const lobbyRoom = `lobby/${savedLobby.id}`;
    this.socket.join(lobbyRoom);
    this.io
      .to(lobbyRoom)
      .emit('roomMessage', `I sent this only to people in ${lobbyRoom}`);
    this.io.emit('lobbyCreated', savedLobby.toJson());
  }

  async getOpenLobbies() {
    const openLobbies = await this.lobbyRepository.find({
      connectedCount: MoreThan(0),
    });
    this.socket.emit(
      'lobbyList',
      openLobbies.map((lobby) => lobby.toJson())
    );
  }
}

export default LobbyController;
