import { getRepository } from 'typeorm';
import Game from '../../../entity/Game';

export class MatchMakingController {
  private gameRepository = getRepository(Game);
  private socket;

  constructor(socket) {
    this.socket = socket;
  }

  openLobby(data: any) {
    console.log(data);
  }

  async getOpenLobbies() {
    const openLobbies = await this.gameRepository.find({ winner: null });
    this.socket.emit('lobbyList', openLobbies);
  }
}

export default MatchMakingController;
