import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../../common/entity/User';
import { hashPassword } from '../../util';
import * as jwt from 'jsonwebtoken';

export class SandboxController {
  //private userRepository = getRepository(User);

  async calculateScore(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.log(request.body.board);
    return;
  }
}
