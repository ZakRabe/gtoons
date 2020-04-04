import { getRepository } from 'typeorm';
import Game from '../../entity/Game';

export class MatchMakingController {
  private gameRepository = getRepository(Game);
  // private queryBuilder = this.gameRepository.createQueryBuilder('game');

  openLobby(data: any) {
    console.log(data);
  }

  async getOpenLobbies() {
    const openLobbies = await this.gameRepository.find({ winner: null });
    return openLobbies;
  }
}
