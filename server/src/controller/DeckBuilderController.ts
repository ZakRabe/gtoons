import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';
import Collection from '../entity/Collection';
import * as jwt from 'jsonwebtoken';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);

  async myCollection(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const collection = await this.collectionRepository.findOne({player : user.userId});
    return collection;
  }
}
