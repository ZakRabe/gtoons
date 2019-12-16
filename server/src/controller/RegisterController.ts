import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';

export class RegisterController {
  private userRepository = getRepository(User);

  async username(request: Request, response: Response, next: NextFunction) {
    const existingUser = await this.userRepository.find({
      username: request.params.username
    });
    return existingUser.length > 1;
  }
}
