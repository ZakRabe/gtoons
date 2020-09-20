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
  const salt = getSalt(16);
  return hashPassword(password, salt);
};

export const verifyToken = (token): AuthTokenUser => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const roll = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const cardsInCollection = (cards: number[], collection: number[]) => {
  console.log(cards);
  console.log(collection);
  return cards.reduce((acc, card) => {
    return (acc = acc && collection.includes(card));
  }, true);
};
