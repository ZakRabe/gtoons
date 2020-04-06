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
    const collection = await this.collectionRepository.findOne({player : user.userId});
    return collection;
  }

  async saveDeck(request: Request, response: Response, next: NextFunction){
    const user = response.locals.jwtPayload;

    console.log("here")
  
    const newDeck = JSON.stringify(request.body.deck);
    console.log(newDeck)
    const deck = {player_id:user.userId,
      cards:JSON.stringify(newDeck)
    }
    await this.deckRepository.save(deck);
}
}
