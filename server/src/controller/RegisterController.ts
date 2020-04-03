import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../entity/User';
const crypto = require('crypto');

export class RegisterController {
  private userRepository = getRepository(User);

  async getUsersByUsername(username: string) {
    return await this.userRepository.find({
      username
    });
  }

  async validUsername(
    request: Request,
    _response: Response,
    _next: NextFunction
  ) {
    const existingUsers = await this.getUsersByUsername(request.query.username);
    return existingUsers.length === 0;
  }

  async getUsersByEmail(email: string) {
    return this.userRepository.find({
      email: email
    });
  }

  async validEmail(request: Request, _response: Response, _next: NextFunction) {
    const existingUsers = await this.getUsersByEmail(request.query.email);
    return existingUsers.length === 0;
  }

  getSalt = length => {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

  hashPassword = (password: string, salt: string) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
      salt: salt,
      passwordHash: value
    };
  };

  saltHashPassword = (password: string) => {
    const salt = this.getSalt(16);
    return this.hashPassword(password, salt);
  };

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
    const { salt, passwordHash } = this.saltHashPassword(newUser.password);

    // save the user
    const userModel = {
      ...newUser,
      salt,
      password: passwordHash
    };

    const { id } = await this.userRepository.save(userModel);

    const savedUser = await this.userRepository.findOne({
      id
    });

    return savedUser.toJson();
  }
}
