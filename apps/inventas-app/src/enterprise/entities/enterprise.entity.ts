import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';
import User from '../../auth/entities/user.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import Category from '../../categories/entities/category.entity';
import Product from '../../products/entities/product.entity';
import Payment from '../../payments/entities/payment.entity';

@Entity('enterprises')
@Unique(['documentNumber', 'documentType'])
export default class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'enum', name: 'document_type', enum: documentTypes })
  documentType: documentTypes;

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
}
