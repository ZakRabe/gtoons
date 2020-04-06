import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Deck extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  name: string;

  @Column()
  cards: string;

  toJson = () => {
    const { id, player_id, name, cards } = this;
    return {
      id,
      player_id,
      name,
      cards,
    };
  };
}
