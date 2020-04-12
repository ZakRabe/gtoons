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

  // TODO. how much do we care about security here?
  @Column()
  password: string;

  toJson = () => {
    const { id, name, created, game, capacity, owner, connectedCount } = this;

    return {
      id,
      name,
      created,
      capacity,
      connectedCount,
      owner: owner.toJson(),
      game: game && game.toJson(),
    };
  };
}
