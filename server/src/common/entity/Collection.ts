import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Collection extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  player: User;

  @Column({ type: "mediumtext"})
  cards: string;

  toJson = () => {
    const { id, player, cards } = this;
    return {
      id,
      player: player.toJson(),
      cards: JSON.parse(cards),
    };
  };
}
