import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { verifyToken } from '../../util';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers['auth'];
  let jwtPayload;
  //Try to validate the token and get data
  try {
    // TODO: load from environment variable
    jwtPayload = verifyToken(token);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  // TODO: load from environment variable
  const newToken = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.setHeader('token', newToken);

  //Call the next middleware or controller
  next();
};
