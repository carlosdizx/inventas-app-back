import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Product from '../../products/entities/product.entity';
import Inventory from './inventory.entity';

@Entity('product_inventories')
export default class ProductInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.productInventories)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Inventory, (inventory) => inventory.productInventories)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column('int')
  quantity: number;
}
