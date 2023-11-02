import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Subcategory from './subcategory.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

@Entity('categories')
@Unique(['name', 'enterprise'])
export default class Category {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ enum: StatusEntity, default: StatusEntity.ACTIVE })
  status: StatusEntity;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    cascade: true,
  })
  subcategories: Subcategory[];

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.categories, {
    nullable: true,
  })
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;
}
