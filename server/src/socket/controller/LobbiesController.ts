import { getRepository, MoreThan } from 'typeorm';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { verifyToken } from '../../util';
import { SockerController } from './SocketController';

export class LobbyController extends SockerController {
  private lobbyRepository = getRepository(Lobby);
  private userRepository = getRepository(User);

  async createLobby({ user: token, name, capacity }) {
    console.log(token);
    let userId;
    try {
      userId = verifyToken(token).userId;
    } catch (error) {
      console.log(error);
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
    // they are in an existing lobby, do nothing
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

    this.io.emit('lobbyCreated', savedLobby.toJson());
    this.socket.emit('lobbyCreateSuccess', savedLobby.toJson().id);
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
