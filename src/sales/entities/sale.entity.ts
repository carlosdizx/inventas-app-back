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
import SaleDetails from './sale.details.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import Inventory from '../../inventories/entities/inventory.entity';
import Client from '../../clients/entities/client.entity';
import { TypeSaleEnum } from '../enums/type-sale.enum';

@Entity('sales')
export default class Sale {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @OneToMany(() => SaleDetails, (salesDetail) => salesDetail.sale)
  salesDetails: SaleDetails[];

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'enum', enum: StatusEntity, default: StatusEntity.ACTIVE })
  status: StatusEntity;

  @Column({ type: 'enum', enum: TypeSaleEnum })
  type: TypeSaleEnum;

  @ManyToOne(() => Enterprise)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @ManyToOne(() => Inventory, { nullable: false })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
