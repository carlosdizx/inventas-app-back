import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Client from '../../clients/entities/client.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import Inventory from '../../inventories/entities/inventory.entity';

@Entity('payments')
export default class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => Client, (client) => client.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.payments)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column({ type: 'enum', enum: StatusEntity, default: StatusEntity.ACTIVE })
  status: StatusEntity;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
