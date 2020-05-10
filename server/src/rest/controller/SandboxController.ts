import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../../common/entity/User';
import { hashPassword } from '../../util';
import * as jwt from 'jsonwebtoken';
import { getCards } from '../../cards/utils';

export class SandboxController {
  //private userRepository = getRepository(User);

  async calculateScore(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    //console.log(request.body.board);
    const board = [...request.body.board] as (number | null)[];
    const cards = getCards(board);
    console.log(cards);
    cards.map(card => {
      card.checkPower(cards);
    });
    return {};
  }
}
