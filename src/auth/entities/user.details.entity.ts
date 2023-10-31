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

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ name: 'document_type', enum: documentTypes })
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
