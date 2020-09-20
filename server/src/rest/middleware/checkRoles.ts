import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../common/entity/User';

export const checkRoles = (
  roles: Array<string>,
  allowSelf: boolean = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous middleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    const selfCheck = allowSelf ? Number(req.params?.id) === id : false;

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1 || selfCheck) {
      next();
    } else {
      res.status(401).send();
    }
  };
};
