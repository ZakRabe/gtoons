import { NextFunction, Request, Response } from 'express';
import { evaluateBoardPowers } from '../../powers/utils';

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
