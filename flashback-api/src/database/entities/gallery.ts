import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
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

  @Column({ default: false })
  showMapInGallery: boolean;

  @Column({ default: false })
  showImagesOnParentFolderMaps: boolean;

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'coverImageId', referencedColumnName: 'id' })
  coverImage: Image | null;

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
