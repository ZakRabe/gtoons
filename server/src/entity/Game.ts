import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class Game extends BaseEntity {
/*
*/
  @PrimaryGeneratedColumn()
  id: number;

  toJson = () => {
    const {id} = this;
    return {
      id
    };
  };
}
