import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { Image } from './image';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @OneToMany(() => Image, (image) => image.account)
  images: Image[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
