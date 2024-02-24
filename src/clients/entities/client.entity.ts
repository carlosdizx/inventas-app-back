import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';

@Entity('clients')
@Unique(['documentNumber', 'documentType'])
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ name: 'document_type', enum: documentTypes })
  documentType: documentTypes;

  @Column()
  names: string;

  @Column()
  surnames: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
