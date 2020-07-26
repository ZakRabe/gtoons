import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Deck from './Deck';
import Game from './Game';
import User from './User';

@Entity()
export default class Lobby extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created: string;

  // for some reason eager here causes crashes in the find query?
  @OneToOne((type) => Game, { eager: true, nullable: true })
  @JoinColumn()
  game: Game | null;

  @Column()
  capacity: number;

  @Column()
  connectedCount: number;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  owner: User;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  seat1: User | null;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  seat2: User | null;

  @Column()
  seat1Ready: number;

  @Column()
  seat2Ready: number;
  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn()
  seat1Deck: Deck | null;

  @ManyToOne((type) => Deck, { eager: true })
  @JoinColumn()
  seat2Deck: Deck | null;

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
      game: game && game.lobbyJson(),
      seat1: seat1 && seat1.toJson(),
      seat2: seat2 && seat2.toJson(),
      seat1Ready: !!seat1Ready,
      seat2Ready: !!seat2Ready,
      seat1Deck: seat1Deck && seat1Deck.toJson(),
      seat2Deck: seat2Deck && seat2Deck.toJson(),
    };
  };
}
