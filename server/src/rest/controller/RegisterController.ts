import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import User from '../../common/entity/User';
import * as cards from '../../cards/cards.json';
import { saltHashPassword } from '../../util';
const crypto = require('crypto');

export class RegisterController {
  private userRepository = getRepository(User);
  private collectionRepository = getRepository(Collection);

  async getUsersByUsername(username: string) {
    return await this.userRepository.find({
      username,
    });
  }

  async validUsername(
    request: Request,
    _response: Response,
    _next: NextFunction
  ) {
    const existingUsers = await this.getUsersByUsername(
      request.query.username as string
    );
    return existingUsers.length === 0;
  }

  async getUsersByEmail(email: string) {
    return this.userRepository.find({
      email: email,
    });
  }

  async validEmail(request: Request, _response: Response, _next: NextFunction) {
    const existingUsers = await this.getUsersByEmail(
      request.query.email as string
    );
    return existingUsers.length === 0;
  }

  async submit(request: Request, response: Response, _next: NextFunction) {
    const newUser = { ...request.body };
    const errors = [];

    if (!newUser.username.trim()) {
      errors.push('Username is required');
    }

    if (!newUser.email.trim()) {
      errors.push('Email is required');
    }

    const existingUsersWithUsername = await this.getUsersByUsername(
      newUser.username
    );

    if (existingUsersWithUsername.length > 0) {
      errors.push('User with this username already exists');
    }

    const existingUsersWithEmail = await this.getUsersByEmail(newUser.email);
    if (existingUsersWithEmail.length > 0) {
      errors.push('An account exists for this email');
    }

    const { password, confirmPassword } = newUser;

    if (password.length < 7) {
      errors.push('Password must be at least 7 characters');
    }
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      errors.push('Password must contain at least 1 uppercase letter');
    }
    const hasLowercase = /[a-z]/.test(password);
    if (!hasLowercase) {
      errors.push('Password must contain at least 1 lowercase charater');
    }

    if (password !== confirmPassword) {
      errors.push("Passwords don't match");
    }

    if (errors.length) {
      return response
        .status(422)
        .json({ errors, message: 'Unable to Register User' });
    }

    // hash the password for secure sortage
    const { salt, passwordHash } = saltHashPassword(newUser.password);

    // save the user
    const userModel = {
      ...newUser,
      salt,
      password: passwordHash,
    };

    const { id } = await this.userRepository.save(userModel);

    const allCards = cards.map((card) => card.id);

    await this.collectionRepository.save({
      player: id,
      cards: JSON.stringify(allCards),
    });

    const savedUser = await this.userRepository.findOne({
      id,
    });

    return savedUser.toJson();
  }
}
