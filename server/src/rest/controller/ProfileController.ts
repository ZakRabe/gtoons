import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Profile from '../../common/entity/Profile';
import User from '../../common/entity/User';

export class ProfileController {
  private profileRepository = getRepository(Profile);
  private userRepository = getRepository(User);

  getProfile = (request: Request, response: Response) => {};

  imageUpload = (request: Request, response: Response) => {};
}
