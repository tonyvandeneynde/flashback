import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Image } from './image';
import { Folder } from './folder';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @OneToMany(() => Image, (image) => image.account)
  images: Image[];

  @OneToMany(() => Folder, (folder) => folder.account)
  folders: Folder[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
