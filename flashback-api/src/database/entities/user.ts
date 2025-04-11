import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account';
import { Image } from './image';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  picture: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;

  @OneToMany(() => Image, (image) => image.addedByUser)
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
