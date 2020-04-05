import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as cards from '../cards/cards.json';

export class CardController {

  async all(request: Request, response: Response, next: NextFunction) {
    return cards;
  }
}