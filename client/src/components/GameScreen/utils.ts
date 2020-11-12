import { Game } from './types';

export const getPlayerNumber = (game: Game, user: { userId: number }) => {
  let playerNumber = -1;
  if (game.player1.id === user.userId) {
    playerNumber = 1;
  }
  if (game.player2.id === user.userId) {
    playerNumber = 2;
  }
  return playerNumber;
};

export const getPlayerKey = (game: Game, user: { userId: number }) => {
  const playerNumber = getPlayerNumber(game, user);
  return `player${playerNumber}`;
};
