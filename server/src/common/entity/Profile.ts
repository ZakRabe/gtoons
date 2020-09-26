import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ nullable: true })
  profilePicType?: 'SVG' | 'PNG';
}
