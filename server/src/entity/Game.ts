import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Game extends BaseEntity {
/*
*/
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1_id: number;

  @Column()
  player2_id: number;

  @Column()
  player1Deck_id: number;

  @Column()
  player2Deck_id: number;

  @Column()
  color1: string;

  @Column()
  color2: string;

  @Column()
  winner: number;

  toJson = () => {
    const {id,player1_id,player2_id,player1Deck_id,player2Deck_id} = this;
    return {
        id,
        player1_id,
        player2_id,
        player1Deck_id,
        player2Deck_id
    };
  };
}
