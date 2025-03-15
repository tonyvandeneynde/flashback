import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Account } from './account';
import { Image } from './image';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;

  @OneToMany(() => Image, (image) => image.addedByUser)
  images: Image[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
