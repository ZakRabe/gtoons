import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../../common/entity/User';
import { hashPassword } from '../../util';
import * as jwt from 'jsonwebtoken';
import { getCards, getDeepCopyCards } from '../../cards/utils';
import Card from '../../common/entity/Card';
import { getPowers, evaluateBoardPowers } from '../../powers/utils';

export class SandboxController {
  //private userRepository = getRepository(User);

  async calculateScore(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const board = [...request.body.board] as (number | null)[];
    return evaluateBoardPowers(board, []);
  }
}
