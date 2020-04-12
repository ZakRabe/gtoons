const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import { AuthTokenUser } from './types';

export const getSalt = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const hashPassword = (password: string, salt: string) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value,
  };
};

export const saltHashPassword = (password: string) => {
  const salt = this.getSalt(16);
  return hashPassword(password, salt);
};

export const verifyToken = (token): AuthTokenUser => {
  return jwt.verify(token, 'GToons2019SecretToken');
};
