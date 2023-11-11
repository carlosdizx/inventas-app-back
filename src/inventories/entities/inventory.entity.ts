import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ProductInventory from './product.inventory.entity';
import Sale from '../../sales/entities/sale.entity';

@Entity('inventories')
export default class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @OneToMany(
    () => ProductInventory,
    (productInventory) => productInventory.inventory,
  )
  productInventories: ProductInventory[];

  @OneToMany(() => Sale, (sale) => sale.inventory)
  sales: Sale[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
