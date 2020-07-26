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

interface Game {
  color1: string | null;
  color2: string | null;
  id: number;
  player1: Player;
  player1Deck: Deck;
  player2: Player;
  player2Deck: Deck;
  winner: Player;
}

export interface GameScreenProps {
  game: Game;
}
