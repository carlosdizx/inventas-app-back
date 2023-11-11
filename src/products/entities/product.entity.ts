import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import Category from '../../categories/entities/category.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import Subcategory from '../../categories/entities/subcategory.entity';
import ProductInventory from '../../inventories/entities/product.inventory.entity';

@Entity('products')
@Unique(['name', 'enterprise'])
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  barcode: string;

  @Column('decimal', { name: 'sale_price' })
  salePrice: number;

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

  @OneToMany(
    () => ProductInventory,
    (productInventory) => productInventory.product,
  )
  productInventories: ProductInventory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
