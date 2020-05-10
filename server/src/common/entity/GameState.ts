import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class GameState extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: make model
  @Column()
  game_id: number;

  @Column()
  turn: number;

  @Column()
  player1Board: string;

  @Column()
  player2Board: string;

  @Column()
  player1Discard: string;

  @Column()
  player2Discard: string;

  @Column()
  player1ShuffledDeck: string;

  @Column()
  player2ShuffledDeck: string;

  toJson = () => {
    const {
      id,
      game_id,
      turn,
      player1ShuffledDeck,
      player2ShuffledDeck,
      player1Board,
      player2Board,
      player1Discard,
      player2Discard,
    } = this;
    return {
      id,
      game_id,
      turn,
      player1ShuffledDeck: JSON.parse(player1ShuffledDeck),
      player2ShuffledDeck: JSON.parse(player2ShuffledDeck),
      player1Board: JSON.parse(player1Board),
      player2Board: JSON.parse(player2Board),
      player1Discard: JSON.parse(player1Discard),
      player2Discard: JSON.parse(player2Discard),
    };
  };

  static validCardCount(turnNumber: number, cardCount: number) {
    let expected;

    switch (turnNumber) {
      case 1:
        expected = 4;
        break;
      case 2:
      case 3:
        expected = 7;
        break;
    }

    return expected !== undefined && expected === cardCount;
  }
}
