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

  async submit(request: Request, response: Response, _next: NextFunction) {
    const newUser = { ...request.body };
    console.log(newUser);

    const existingUsersWithUsername = await this.userRepository.find({
      username: request.params.username
    });

    if (existingUsersWithUsername.length > 0) {
      response.statusCode = 422;
      response.statusMessage = 'User with this username already exists';
    }

    const existingUsersWithEmail = await this.userRepository.find({
      email: request.params.email
    });

    if (existingUsersWithEmail.length > 0) {
      response.statusCode = 422;
      response.statusMessage = 'An account exists for this email. ';
    }

    const { password, confirmPassword } = newUser;

    const passwordErrors = [];

    if (password.length < 7) {
      passwordErrors.push('Must be at least 7 characters');
    }
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      passwordErrors.push('Must contain at least 1 uppercase letter');
    }
    const hasLowercase = /[a-z]/.test(password);
    if (!hasLowercase) {
      passwordErrors.push('Must contain at least 1 lowercase charater');
    }

    if (passwordErrors.length > 0) {
      response.statusCode = 422;
      response.statusMessage = passwordErrors.join('. ');
    }

    if (password !== confirmPassword) {
      response.statusCode = 422;
      response.statusMessage = "Passwords don't match";
    }

    if (response.statusCode === 422) {
      return response.json({ message: response.statusMessage });
    }

    // save the user
    // const savedUser = await this.userRepository.save(newUser);

    return null;
  }
}
