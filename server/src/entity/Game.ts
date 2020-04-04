import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player1_id' })
  player1: number;

  @Column({ name: 'player2_id' })
  player2: number;

  @Column({ name: 'player1Deck_id' })
  player1Deck: number;

  @Column({ name: 'player2Deck_id' })
  player2Deck: number;

  @Column()
  color1: string;

  @Column()
  color2: string;

  @Column({ name: 'winner_id' })
  winner: number;

  toJson = () => {
    const { id, player1, player2, player1Deck, player2Deck, winner } = this;

    return {
      id,
      player1,
      player2,
      player1Deck,
      player2Deck,
      winner
    };
  };
}
