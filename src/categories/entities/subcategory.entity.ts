import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from './category.entity';

@Entity('subcategories')
export default class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;
}
