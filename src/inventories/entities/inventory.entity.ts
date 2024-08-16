import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ProductInventory from './product.inventory.entity';
import Sale from '../../sales/entities/sale.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';

@Entity('inventories')
export default class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'name' })
  name: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ name: 'zipcode', nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(
    () => ProductInventory,
    (productInventory) => productInventory.inventory,
  )
  productInventories: ProductInventory[];

  @OneToMany(() => Sale, (sale) => sale.inventory)
  sales: Sale[];

  @ManyToOne(() => Enterprise)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
