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

<<<<<<< HEAD
  @Column({ type: "mediumtext"})
=======
  @Column({ type: 'longtext' })
>>>>>>> 8c8403397fbc75c7a00d30101c86311a7d89b962
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
