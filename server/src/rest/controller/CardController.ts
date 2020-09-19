import { NextFunction, Request, Response } from 'express';
import * as cards from '../../cards/cards.json';
import { getCards } from '../../cards/utils';

export class CardController {
  async all(request: Request, response: Response, next: NextFunction) {
    return cards;
  }
  async some(request: Request, response: Response) {
    const { cardIds } = request.body;
    try {
      return getCards(cardIds);
    } catch (error) {
      console.error(error);
      return "what are you tryin to do here? You're sketch";
    }
  }
}
