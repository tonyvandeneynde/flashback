import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Folder } from './folder';
import { Image } from './image';
import { Account } from './account';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Account, (account) => account.folders)
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => Folder, (folder) => folder.galleries, { nullable: true })
  @JoinColumn({ name: 'folderId', referencedColumnName: 'id' })
  parent: Folder | null;

  @OneToMany(() => Image, (image) => image.gallery)
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;
}
