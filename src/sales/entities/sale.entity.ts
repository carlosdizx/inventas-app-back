import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import SaleDetails from './sale.details.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
