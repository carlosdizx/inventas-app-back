import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import Product from '../../products/entities/product.entity';

@Entity('categories')
@Unique(['name', 'enterprise'])
export default class Category {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: StatusEntity, default: StatusEntity.ACTIVE })
  status: StatusEntity;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.categories)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
