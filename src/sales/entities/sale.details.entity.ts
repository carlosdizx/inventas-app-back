import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Product from '../../products/entities/product.entity';
import Sale from './sale.entity';

@Entity('sales_details')
export default class SaleDetails {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Sale, { eager: true })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;
}
