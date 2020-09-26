import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  getRepository,
} from 'typeorm';

import Profile from './Profile';

@Entity()
export default class User extends BaseEntity {
  @AfterInsert()
  defaultProfile() {
    const profileRepository = getRepository(Profile);
    profileRepository
      .save({
        displayName: this.username,
      })
      .then((profile) => {
        this.profile = profile;
        this.save(); // Is this even necessary?
      });
  }

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

  @OneToOne((type) => Profile, { eager: true })
  @JoinColumn()
  profile: Profile;

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
