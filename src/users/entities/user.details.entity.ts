import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';
import User from './user.entity';

@Entity('user_details')
@Unique(['documentNumber', 'documentType'])
export default class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'enum', name: 'document_type', enum: documentTypes })
  documentType: documentTypes;

  @Column()
  phone: string;

  @Column()
  gender: boolean;

  @Column({ type: 'date' })
  birthdate: Date;

  @OneToOne(() => User, (user) => user.userDetails)
  user: User;
}
