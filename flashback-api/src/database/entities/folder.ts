import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  TreeChildren,
  Tree,
  TreeParent,
} from 'typeorm';
import { Gallery } from './gallery';
import { Account } from './account';

@Entity()
@Tree('closure-table')
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  showMapInFolder: boolean;

  @ManyToOne(() => Account, (account) => account.folders)
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: Account;

  @TreeParent()
  parent: Folder;

  @TreeChildren()
  subfolders: Folder[];

  @OneToMany(() => Gallery, (gallery) => gallery.parent)
  galleries: Gallery[];
}
