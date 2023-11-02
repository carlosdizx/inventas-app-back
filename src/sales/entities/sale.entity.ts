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

@Entity('sales')
export default class Sale {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'document_client' })
  documentClient: string;

  @OneToMany(() => SaleDetails, (salesDetail) => salesDetail.sale)
  salesDetails: SaleDetails[];

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @ManyToOne(() => Enterprise)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
