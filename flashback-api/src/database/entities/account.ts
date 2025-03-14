import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
