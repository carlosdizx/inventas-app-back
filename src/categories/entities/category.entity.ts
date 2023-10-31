import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export default class Category {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;
}
