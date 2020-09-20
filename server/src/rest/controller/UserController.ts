import { NextFunction, Request, response, Response } from 'express';
import { getRepository } from 'typeorm';
import PasswordReset from '../../common/entity/PasswordReset';
import User from '../../common/entity/User';
import { v4 as uuidv4 } from 'uuid';
import { saltHashPassword, verifyToken } from '../../util';

export class UserController {
  private userRepository = getRepository(User);
  private passwordResetRepository = getRepository(PasswordReset);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const userToRemove = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(userToRemove);
  }

  async passwordReset(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email } = request.body;
    const userToReset = await this.userRepository.findOne({ where: { email } });

    if (!userToReset) {
      return false;
    }

    // check if the user has an existing
    const existing = await this.passwordResetRepository.findOne({
      where: { user: { id: userToReset.id } },
    });

    if (existing) {
      // TODO: Resend the email
      return true;
    }
    const newReset = {
      user: userToReset,
      token: uuidv4(),
    };

    const { id } = await this.passwordResetRepository.save(newReset);
    const model = await this.passwordResetRepository.findOne(id);
    // TODO: Send the email

    return true;
  }

  async passwordResetToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { token } = request.query;
    const model = await this.passwordResetRepository.findOne({
      where: { token },
    });

    return !!model;
  }

  async passwordChange(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { token, password } = request.body;

    // 7 character min
    // 1 uppercase
    // 1 lowercase
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

    if (!token || !!passwordErrors.length) {
      return false;
    }

    const model = await this.passwordResetRepository.findOne({
      where: { token },
    });

    if (!model) {
      return false;
    }

    const user = await this.userRepository.findOne(model.user.id);
    if (!user) {
      return false;
    }
    // do the PW change

    const { salt, passwordHash } = saltHashPassword(password);

    user.salt = salt;
    user.password = passwordHash;
    await user.save();

    // delete the update token
    await model.remove();

    return true;
  }

  async updateProfilePic(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { user } = request.query;
    console.log(user);
    return true;
  }
}
