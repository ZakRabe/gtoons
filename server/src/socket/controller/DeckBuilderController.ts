import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import Deck from '../../common/entity/Deck';
import User from '../../common/entity/User';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);
  private deckRepository = getRepository(Deck);

  private socket;

  constructor(socket) {
    this.socket = socket;
  }

  async getCollection(data: any) {
    const { player_id } = data;
    const collection = await this.collectionRepository.find({
      player: player_id,
    });

    this.socket.emit('collection', collection);
  }

  async saveDeck(data: any) {
    const { id, player_id, cards } = data;
    const deck = {
      id,
      player_id,
      cards,
    };
    await this.deckRepository.save(deck);
  }
}
export default DeckBuilderController;
