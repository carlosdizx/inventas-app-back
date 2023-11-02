import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Category from './category.entity';
import Product from '../../products/entities/product.entity';

@Entity('subcategories')
@Unique(['name', 'category'])
export default class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];
}
