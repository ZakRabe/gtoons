import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import Deck from '../../common/entity/Deck';
import User from '../../common/entity/User';
import { roll } from '../../util';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);
  private deckRepository = getRepository(Deck);
  private userRepository = getRepository(User);

  async myCollection(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const collection = await this.collectionRepository.findOne({
      player: user.userId,
    });
    return collection;
  }

  // TODO: Make this method update the deck if it exists
  async saveDeck(request: Request, response: Response, next: NextFunction) {
    const { userId } = response.locals.jwtPayload;
    const user = await this.userRepository.findOne(userId);

    const deckName = request.body.name;
    const newDeck = JSON.stringify(request.body.deck);
    let deckFace = null;
    if (newDeck.length > 0) {
      const random = roll(0, newDeck.length - 1);
      deckFace = request.body.face || newDeck[random];
    }

    // TODO: If updating: validate the deck belongs to them

    const deck = {
      player: user,
      name: deckName,
      face: deckFace,
      cards: newDeck,
    };
    const { id } = await this.deckRepository.save(deck);
    const savedDeck = await this.deckRepository.findOne({
      id,
    });

    return savedDeck.toJson();
  }

  async myDeckList(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const deckLists = await this.deckRepository.find({
      player: { id: user.userId },
    });

    return deckLists.map((deck) => deck.toJson());
  }

  // TODO: Remove this. use the same save endpoint for update.
  async updateDeck(request: Request, response: Response, next: NextFunction) {

    if (request.body.deck.count > 12 || (request.body.face != null && !request.body.deck.includes(request.body.face))) {
      return response.sendStatus(400);
    }

    const user = response.locals.jwtPayload;

    const deckId = request.body.id;
    const deckName = request.body.name;
    const newDeck = JSON.stringify(request.body.deck);
    const deckFace = request.body.face;

    const oldDeck = await this.deckRepository.findOne(deckId);
    if (oldDeck.player.id !== user.userId) {
      return response.sendStatus(401);
    }

    oldDeck.name = deckName;
    oldDeck.face = deckFace;
    oldDeck.cards = newDeck;
    await oldDeck.save();

    return oldDeck;
  }
}
