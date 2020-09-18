import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';

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
  role: string;

  @Column({ nullable: true })
  profilePic?: string;

  @CreateDateColumn()
  created_at: Date;

  toJson = () => {
    // we don't want to expose user's email address or password via JSON
    const { id, username, role } = this;
    return {
      id,
      username,
      role
    };
  };
}
