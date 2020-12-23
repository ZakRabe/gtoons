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
import GameState from './GameState';
import { getCard } from '../../cards/utils';

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

  @Column({ nullable: true })
  color2: string;

  @OneToOne((type) => User, { eager: true, nullable: true })
  @JoinColumn()
  winner: User;

  @OneToOne((type) => GameState, (state) => state.game, {
    eager: true,
  })
  gameState: GameState;

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
      gameState,
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
      gameState: gameState && gameState.toJson(),
    };
  };

  lobbyJson = () => {
    const { player1Deck, player2Deck, ...rest } = this.toJson();
    const p1Shuffled = JSON.parse(this.gameState.player1ShuffledDeck);
    const p2Shuffled = JSON.parse(this.gameState.player2ShuffledDeck);

    const p1CutReveal = getCard(p1Shuffled[11]);
    const p2CutReveal = getCard(p2Shuffled[11]);

    return {
      ...rest,
      p1CutReveal,
      p2CutReveal,
    };
  };

  static generateColors = (cards1: Card[], cards2: Card[]) => {
    console.log('Generating colors')
    const bottom1 = cards1[cards1.length - 1];
    const bottom2 = cards2[cards2.length - 1];

    const color1Index = roll(0, bottom1.colors.length - 1);
    const color2Index = roll(0, bottom2.colors.length - 1);

    const color1 = bottom1.colors[color1Index];
    const color2 = bottom2.colors[color2Index];

    if (color1 === color2) {
      return [color1, null];
    }
    return [color1, color2];
  };
}
