import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { roll } from '../../util';
import Card from './Card';
import Deck from './Deck';
import User from './User';

@Entity()
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  player1: User;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  player2: User;

  @OneToOne((type) => Deck, { eager: true })
  @JoinColumn()
  player1Deck: Deck;

  @OneToOne((type) => Deck, { eager: true })
  @JoinColumn()
  player2Deck: Deck;

  @Column()
  color1: string;

  @Column()
  color2: string;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
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
      player1: player1 && player1.toJson(),
      player2: player2 && player2.toJson(),
      player1Deck: player1 && player1Deck.toJson(),
      player2Deck: player2Deck && player1Deck.toJson(),
      winner: winner && winner.toJson(),
    };
  };

  static generateColors = (cards1: Card[], cards2: Card[]) => {
    console.log(cards1);
    console.log(cards2);
    const index1 = roll(0, 11);
    const index2 = roll(0, 11);

    const colors1 = cards1[index1].colors;
    const color1 = colors1[roll(0, colors1.length - 1)];

    const colors2 = cards2[index2].colors;
    const color2 = colors2[roll(0, colors2.length - 1)];

    if (color1 === color2) {
      return [color1, null];
    }
    return [color1, color2];
  };
}
