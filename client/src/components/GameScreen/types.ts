interface Player {
  id: number;
  username: string;
  role: string | null;
}
interface Deck {
  id: number;
  name: string;
  cards: number[];
  face: number;
}

export interface GameState {
  id: number;
  turn: number;

  player1Board: number[];
  player2Board: number[];
  player1Discard: number[];
  player2Discard: number[];
}

interface Game {
  color1: string | null;
  color2: string | null;
  id: number;
  player1: Player;
  player1Deck: Deck;
  player2: Player;
  player2Deck: Deck;
  winner: Player;
  gameState: GameState;
}

export interface GameScreenProps {
  game: Game;
}
