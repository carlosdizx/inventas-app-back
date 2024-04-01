import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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
import PlanEnterprise from './plan.enterprise.entity';

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

  @ManyToOne(() => User, (user) => user.enterprise, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => User, (user) => user.enterprise)
  users: User[];

  @OneToMany(() => Payment, (payment) => payment.client)
  payments: Payment[];

  @OneToMany(() => Category, (category) => category.enterprise)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.enterprise)
  products: Product[];

  @ManyToOne(
    () => PlanEnterprise,
    (planEnterprise) => planEnterprise.enterprises,
    { nullable: true },
  )
  @JoinColumn()
  plan: PlanEnterprise;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
