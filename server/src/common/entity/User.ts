<<<<<<< HEAD
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';
=======
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
>>>>>>> 8c8403397fbc75c7a00d30101c86311a7d89b962

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

<<<<<<< HEAD
  @Column()
  role: string;

  @Column({ nullable: true })
  profilePic?: string;

  @CreateDateColumn()
  created_at: Date;
=======
  @Column({ default: 'PLAYER' })
  role?: 'PLAYER' | 'ADMIN';

  @CreateDateColumn()
  created: string;
>>>>>>> 8c8403397fbc75c7a00d30101c86311a7d89b962

  toJson = () => {
    // we don't want to expose user's email address or password via JSON
    const { id, username, role } = this;
    return {
      id,
      username,
<<<<<<< HEAD
      role
=======
      role,
      created,
>>>>>>> 8c8403397fbc75c7a00d30101c86311a7d89b962
    };
  };
}
