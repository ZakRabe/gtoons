import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';
import Deck from './Deck';

@Entity()
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn({ name: 'player1Deck_id' })
  player1Deck: Deck;

  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn({ name: 'player2Deck_id' })
  player2Deck: Deck;

  @Column()
  color1: string;

  @Column()
  color2: string;

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'winner_id' })
  winner: User;

  toJson = () => {
    const { id, player1, player2, player1Deck, player2Deck, winner } = this;

    return {
      id,
      player1: player1.toJson(),
      player2: player2 && player2.toJson(),
      player1Deck: player1Deck.toJson(),
      player2Deck: player2Deck && player1Deck.toJson(),
      winner: winner && winner.toJson(),
    };
  };
}
