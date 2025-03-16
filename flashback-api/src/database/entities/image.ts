import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Tag } from './tag';
import { User } from './user';
import { Account } from './account';
import { Gallery } from './gallery';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Account, (user) => user.images)
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'addedByUserEmail', referencedColumnName: 'email' })
  addedByUser: User;

  @ManyToOne(() => Gallery, (gallery) => gallery.images)
  @JoinColumn({ name: 'galleryId', referencedColumnName: 'id' })
  gallery: Gallery;

  @Column()
  originalPath: string;

  @Column()
  mediumPath: string;

  @Column()
  thumbnailPath: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @ManyToMany(() => Tag, (tag) => tag.images)
  @JoinTable()
  tags: Tag[];
}
