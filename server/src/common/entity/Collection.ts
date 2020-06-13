import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Collection extends BaseEntity {
  /*
   */
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: rename this column playerId. to be able to use a User model here bug with join columns
  // @OneToOne((type) => User, { eager: true })
  // @JoinColumn()
  @Column({ name: 'player_id' })
  player: number;

  @Column()
  cards: string;

  toJson = () => {
    const { id, player, cards } = this;
    return {
      id,
      player,
      cards: JSON.parse(cards),
    };
  };
}
