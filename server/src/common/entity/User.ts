import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

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

  // This prevents the salt from coming with any request
  @Column({ select: false })
  salt: string;

  @Column({ nullable: true })
  profilePic?: '';

  @Column({ nullable: true })
  profilePicType?: 'SVG' | 'PNG';

  @Column({ default: 'PLAYER' })
  role?: 'PLAYER' | 'ADMIN';

  @CreateDateColumn()
  created: string;

  toJson = () => {
    // we don't want to expose user's email address or password via JSON
    const { id, username, role } = this;
    return {
      id,
      username,
      role,
    };
  };
}
