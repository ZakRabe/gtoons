import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../../common/entity/User';
import { hashPassword } from '../../util';
import * as jwt from 'jsonwebtoken';

export class LoginController {
  private userRepository = getRepository(User);

  loginFail = (response: Response) => {
    // we don't want to tell the user if the username or password was wrong
    // so we return a generic error message
    return response.status(401.1).json({
      message: 'Unable to log you in with these credentials',
      errors: ['Invalid Username or Password'],
    });
  };

  validateToken = (request: Request, response: Response) => {
    // this endpoint does nothing, and is just used to see if the request's token is valid
    return { user: response.locals.jwtPayload };
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
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // generate non-identifying
    const { passwordHash: gaUserId } = hashPassword(user.username, salt);

    return response.send({ token, user, gaUserId: gaUserId.substr(0, 10) });
  };

  // TODO
  // async forgotPassword() {}
}
