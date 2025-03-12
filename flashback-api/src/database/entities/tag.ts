import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Image } from './image';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Image, (image) => image.tags)
  images: Image[];
}
