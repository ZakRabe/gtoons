import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Game from './Game';

@Entity({ name: 'gamestate' })
export default class GameState extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Game)
  @JoinColumn()
  game: Game;

  @Column({ default: 0 })
  turn: number;

  @Column({ default: '[]' })
  player1Board: string;

  @Column({ default: '[]' })
  player2Board: string;

  @Column({ default: '[]' })
  player1Discard: string;

  @Column({ default: '[]' })
  player2Discard: string;

  @Column({ default: '[]' })
  player1ShuffledDeck: string;

  @Column({ default: '[]' })
  player2ShuffledDeck: string;

  @Column({ default: 0 })
  connectedPlayers: number;

  toJson = () => {
    const {
      id,
      game,
      turn,

      player1Board,
      player2Board,
      player1Discard,
      player2Discard,
    } = this;
    return {
      id,
      turn,
      game: game && game.toJson(),
      // player1ShuffledDeck: JSON.parse(player1ShuffledDeck),
      // player2ShuffledDeck: JSON.parse(player2ShuffledDeck),
      player1Board: JSON.parse(player1Board),
      player2Board: JSON.parse(player2Board),
      player1Discard: JSON.parse(player1Discard),
      player2Discard: JSON.parse(player2Discard),
    };
  };

  handJson = (playerNumber: number, turnNumber: number) => {
    const base = this.toJson();
    const player = `player${playerNumber}`;
    const discard = base[`${player}Discard`];
    const deck: number[] = JSON.parse(this[`${player}ShuffledDeck`]);
    let handSize = 0;
    let offset = 0;
    switch (turnNumber) {
      case 1:
        handSize = 6;

        break;
      case 2:
        handSize = 4 + discard.length;
        offset = 5;
        break;
    }

    return deck.slice(offset, handSize);
  };

  static validCardCount(turnNumber: number, cardCount: number): boolean {
    switch (turnNumber) {
      // turn 1 is locking in your four first cards
      case 1:
        return cardCount === 4;
      // turn 2 is locking in your last 3 cards
      case 2:
        return cardCount === 3;
      // turn 3 is your chance to change your last card
      // so either 1 or 2 cards
      case 3:
        return cardCount < 2;
    }
    return false;
  }

  static updateBoardState(
    turnNumber: number,
    previous: number[],
    newCards: number[]
  ) {
    // this whole method is just hyper safe. assume there could be jank or null in the other slots in the board state array
    // and only operate on data we know will come out on the other side with the correct number of cards in the board state
    let prevEnd = 0;
    let newEnd = 0;
    switch (turnNumber) {
      // turn 1 is locking in your four first cards
      // grab the empty previous board state, and the first 4 cards from the new cards
      case 1:
        newEnd = 4;
        break;
      // turn 2 is locking in your last 3 cards
      // grab the first 4 cards from the previous board state, and add the first 3 cards from the new card
      case 2:
        prevEnd = 4;
        newEnd = 3;
        break;
      // turn 3 is your chance to change your last card
      // if the user didnt send a new card, we're done here
      // if they did, grab the first 6 cards from the previous board state, and add the new one
      case 3:
        prevEnd = newCards.length === 0 ? 7 : 6;
        newEnd = newCards.length === 0 ? 0 : 1;
    }

    const newBoardState = previous
      .slice(0, prevEnd)
      .concat(newCards.slice(0, newEnd));
  }

  // send an array of cardIds and an array for a deck
  // returns true if all the cards are in the deck
  static validateNewCards(newCards: number[], deck: number[]) {
    const notInDeck = newCards.some((cardId) => !deck.includes(cardId));
    return !notInDeck;
  }
}
