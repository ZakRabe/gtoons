import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @OneToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'seat2_player_id' })
  seat2: User;

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
    };
  };
}
