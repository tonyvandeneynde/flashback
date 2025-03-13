import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag';
import { Optional } from '@nestjs/common';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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
