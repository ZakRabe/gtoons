import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../../common/entity/User';
import Collection from '../../common/entity/Collection';
import * as jwt from 'jsonwebtoken';
import Deck from '../../common/entity/Deck';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);
  private deckRepository = getRepository(Deck);

  async myCollection(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const collection = await this.collectionRepository.findOne({
      player: user.userId,
    });
    return collection;
  }

  async saveDeck(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;

    const deckName = request.body.name;
    const newDeck = JSON.stringify(request.body.deck);
    console.log(newDeck);
    const deck = { player_id: user.userId, name: deckName, cards: newDeck };
    const { id } = await this.deckRepository.save(deck);
    const savedDeck = await this.deckRepository.findOne({
      id,
    });

    return savedDeck.toJson();
  }

  async myDeckList(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const deckLists = await this.deckRepository.find({
      player_id: user.userId,
    });

    return deckLists.map((deck) => deck.toJson());
  }

  async updateDeck(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const { deckId, name, deck } = request.body;

    //Do validation before trying to update?
    // if not their deck return 401
    //Update deck
    // const updated = await this.deckRepository.update(deckId, {
    //   name,
    //   cards: JSON.stringify(deck),
    // });

    const old = await this.deckRepository.findOne(deckId);
    console.log(old);
    const updatedModel = {
      id: deckId,
      player_id: user.userId,
      name,
      cards: JSON.stringify(deck),
    };

    await this.deckRepository.save(updatedModel);

    const updatedDeck = await this.deckRepository.findOne(deckId);

    console.log(updatedDeck);
    // const newDeck = {
    //   name,
    //   id: deckId,
    //   player_id: user.userId,
    //   cards: deck,
    // };

    return updatedDeck.toJson();
  }
}
