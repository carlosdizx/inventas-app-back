import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Category from '../../categories/entities/category.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import Subcategory from '../../categories/entities/subcategory.entity';

@Entity('products')
@Unique(['name', 'enterprise'])
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  barcode: string;

  @Column('decimal', { name: 'selling_price' })
  sellingPrice: number;

  @Column('decimal', { name: 'cost_price' })
  costPrice: number;

  @Column('int', { name: 'discount_percentage' })
  discountPercentage: number;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.products)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;
}
