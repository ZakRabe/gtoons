import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';
import Collection from '../entity/Collection';
import * as jwt from 'jsonwebtoken';
import Deck from '../entity/Deck';

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
    await this.deckRepository.save(deck);

    return deck;
  }

  async myDeckList(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const deckList = await this.deckRepository.find({ player_id: user.userId });

    return deckList ? deckList : [];
  }

  async updateDeck(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const { deckId, name: newName, deck } = request.body;

    //Do validation before trying to update?

    //Update deck
    const updated = await this.deckRepository.update(deckId, {
      name: newName,
      cards: JSON.stringify(deck),
    });

    const newDeck = {
      id: deckId,
      player_id: user.userId,
      name: newName,
      cards: deck,
    };

    return newDeck;
  }
}
