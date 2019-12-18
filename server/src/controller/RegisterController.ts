import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';

export class RegisterController {
  private userRepository = getRepository(User);

  async validUsername(
    request: Request,
    _response: Response,
    _next: NextFunction
  ) {
    const existingUsers = await this.userRepository.find({
      username: request.params.username
    });
    return existingUsers.length === 0;
  }

  async validEmail(request: Request, _response: Response, _next: NextFunction) {
    const existingUsers = await this.userRepository.find({
      email: request.params.email
    });
    return existingUsers.length === 0;
  }
}
