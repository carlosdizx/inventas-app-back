import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Enterprise from './enterprise.entity';
import Product from '../../products/entities/product.entity';

@Entity('plans')
export default class PlanEnterprise extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'max_users' })
  maxUsers: number;

  @OneToMany(() => Enterprise, (enterprise) => enterprise.plan)
  products: Product[];
  enterprises: Enterprise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
