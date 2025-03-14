import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
