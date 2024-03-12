import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import User from '../../auth/entities/user.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import Category from '../../categories/entities/category.entity';
import Product from '../../products/entities/product.entity';
import Payment from '../../payments/entities/payment.entity';

@Entity('enterprises')
@Unique(['name'])
export default class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: StatusEntity,
    default: StatusEntity.PENDING_APPROVAL,
  })
  status: StatusEntity;

  @OneToMany(() => User, (user) => user.enterprise)
  users: User[];

  @OneToMany(() => Payment, (payment) => payment.client)
  payments: Payment[];

  @OneToMany(() => Category, (category) => category.enterprise)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.enterprise)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
