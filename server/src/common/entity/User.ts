import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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

  @Column()
  role?: string;

  @Column()
  profilePic?: string;

  @Column()
  created: string;

  toJson = () => {
    // we don't want to expose user's email address or password via JSON
    const { id, username, created, role } = this;
    return {
      id,
      username,
      role,
      created,
    };
  };
}
