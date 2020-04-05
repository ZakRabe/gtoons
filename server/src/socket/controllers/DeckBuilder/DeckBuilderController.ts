import { getRepository } from 'typeorm';
import Collection from '../../../entity/Collection';
import User from '../../../entity/User';
import Deck from '../../../entity/Deck';
import * as cards from '../../../cards/cards.json';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);
  private userRepository = getRepository(User);
  private deckRepository = getRepository(Deck);
  

  private socket;

  constructor(socket) {
    this.socket = socket;
  }

  async getCollection(data:any){
      const {player_id} = data
      const collection = await this.collectionRepository.find({player : player_id});

      this.socket.emit('collection',collection);
  }

  async saveDeck(data:any){
      const {id,player_id,cards} = data
      const deck = {
        id:id,
        player_id:player_id,
        cards:cards
    }
      await this.deckRepository.save(deck);
  }
}
export default DeckBuilderController;
