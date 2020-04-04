import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../entity/User';
import { hashPassword } from '../util';
import * as jwt from 'jsonwebtoken';
import { checkJwt } from '../middleware/checkJwt';

export class LoginController {
  private userRepository = getRepository(User);

  loginFail = (response: Response) => {
    // we don't want to tell the user if the username or password was wrong
    // so we return a generic error message
    return response.status(401.1).json({
      message: 'Unable to log you in with these credentials',
      errors: ['Invalid Username or Password']
    });
  };

  validateToken = () => {
    // this endpoint does nothing, and is just used to see if the request's token is valid
    return true;
  };

  submit = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    const { username, password } = request.body;

    const user = await this.userRepository.findOne({ username });

    if (!user) {
      return this.loginFail(response);
    }

    const { salt, password: userPassword } = user;

    const { passwordHash } = hashPassword(password, salt);

    if (passwordHash !== userPassword) {
      return this.loginFail(response);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      //TODO load for env var
      'GToons2019SecretToken',
      { expiresIn: '1h' }
    );

    return response.send(token);
  };

  // TODO
  // async forgotPassword() {}
}
