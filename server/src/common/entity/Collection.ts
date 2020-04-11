import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Collection extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id' })
  player: number;

  @Column()
  cards: string;

  toJson = () => {
    const { id, player, cards } = this;
    return {
      id,
      player,
      cards
    };
  };
}
