import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import Game from './Game';
import User from './User';
import Deck from './Deck';

@Entity()
export default class Lobby extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created: string;

  @OneToOne((type) => Game, { eager: true })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column()
  capacity: number;

  @Column()
  connectedCount: number;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'owner_player_id' })
  owner: User;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'seat1_player_id' })
  seat1: User;

  @Column()
  seat1Ready: number;

  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn()
  seat1Deck: Deck;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'seat2_player_id' })
  seat2: User;

  @Column()
  seat2Ready: number;

  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn()
  seat2Deck: Deck;

  @Column()
  seatRule: number;

  // TODO. how much do we care about security here?
  @Column()
  password: string;

  toJson = () => {
    const {
      id,
      name,
      created,
      game,
      capacity,
      owner,
      connectedCount,
      seat1,
      seat2,
      seatRule,
      seat1Ready,
      seat2Ready,
      seat1Deck,
      seat2Deck,
    } = this;

    return {
      id,
      name,
      created,
      capacity,
      connectedCount,
      seatRule,
      owner: owner.toJson(),
      game: game && game.toJson(),
      seat1: seat1 && seat1.toJson(),
      seat2: seat2 && seat2.toJson(),
      seat1Ready: !!seat1Ready,
      seat2Ready: !!seat2Ready,
      seat1Deck: seat1Deck && seat1Deck.toJson(),
      seat2Deck: seat2Deck && seat2Deck.toJson(),
    };
  };
}
