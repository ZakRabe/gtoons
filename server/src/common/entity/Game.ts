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
import Card from './Card';
import { roll } from '../../util';

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
    const {
      id,
      player1,
      player2,
      player1Deck,
      player2Deck,
      winner,
      color1,
      color2,
    } = this;

    return {
      id,
      color1,
      color2,
      player1: player1.toJson(),
      player2: player2 && player2.toJson(),
      player1Deck: player1Deck.toJson(),
      player2Deck: player2Deck && player1Deck.toJson(),
      winner: winner && winner.toJson(),
    };
  };

  static generateColors = (cards1: Card[], cards2: Card[]) => {
    const index1 = roll(0, 11);
    const index2 = roll(0, 11);

    const colors1 = cards1[index1].color;
    const color1 = colors1[roll(0, colors1.length - 1)];

    const colors2 = cards2[index2].color;
    const color2 = colors2[roll(0, colors2.length - 1)];

    if (color1 === color2) {
      return [color1, null];
    }
    return [color1, color2];
  };
}
