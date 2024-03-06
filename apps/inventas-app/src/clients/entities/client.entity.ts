import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

@Entity('clients')
@Unique(['documentNumber', 'documentType'])
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ name: 'document_type', enum: documentTypes })
  documentType: documentTypes;

  @Column({ enum: StatusEntity, default: StatusEntity.ACTIVE })
  status: StatusEntity;

  @Column()
  names: string;

  @Column()
  surnames: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.categories)
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
