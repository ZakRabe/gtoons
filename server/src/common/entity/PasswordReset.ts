import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import User from './User';

@Entity({ name: 'pw_reset' })
export default class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  token: string;

  toJson = () => {
    const { id, user, token } = this;
    return {
      id,
      token,
      user: user.toJson(),
    };
  };
}
