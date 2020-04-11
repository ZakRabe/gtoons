import { getRepository } from 'typeorm';
import Deck from '../../../entity/Deck';
import Game from '../../../entity/Game';
import User from '../../../entity/User';
import { verifyToken } from '../../../util';
import { SockerController } from '../SocketController';

export class MatchMakingController extends SockerController {
  private gameRepository = getRepository(Game);
  private userRepository = getRepository(User);
  private deckRepository = getRepository(Deck);

  async createLobby({ user: token, deck }) {
    let userId;
    try {
      userId = verifyToken(token).userId;
    } catch (error) {
      console.error('Invalid Auth Token');
      return;
    }

    const player1 = await this.userRepository.findOne({
      id: userId,
    });
    const existingLobby = await this.gameRepository.find({
      where: [
        {
          player1: player1,
        },
        {
          player2: player1,
        },
      ],
    });
    // they are in an existing game, do nothing
    if (existingLobby.length) {
      return;
    }

    const player1Deck = await this.deckRepository.findOneOrFail({ id: deck });

    const newLobby = this.gameRepository.create({
      player1,
      player1Deck,
    });
    await newLobby.save();

    this.socket.emit('lobbyCreated', newLobby.toJson());
  }

  async getOpenLobbies() {
    const openLobbies = await this.gameRepository.find({ winner: null });
    this.socket.emit(
      'lobbyList',
      openLobbies.map((lobby) => lobby.toJson())
    );
  }
}

export default MatchMakingController;
