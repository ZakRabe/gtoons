import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class GameState extends BaseEntity {
/*
*/
@PrimaryGeneratedColumn()
id: number;

@Column()
game_id: number;

@Column()
turn: number;

@Column()
player1Board: string;

@Column()
player2Board: string;

@Column()
player1Discard: string;

@Column()
player2Discard: string;

@Column()
player1ShuffledDeck: string;

@Column()
player2ShuffledDeck: string;

toJson = () => {
    const {id,game_id,turn,player1ShuffledDeck,player2ShuffledDeck,player1Board,player2Board,player1Discard,player2Discard} = this;
    return {
        id,
        game_id,
        turn,
        player1ShuffledDeck,
        player2ShuffledDeck,
        player1Board,
        player2Board,
        player1Discard,
        player2Discard
    };
  };
}