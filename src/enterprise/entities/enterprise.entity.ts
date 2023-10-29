import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';
import User from '../../auth/entities/user.entity';

@Entity('enterprises')
@Unique(['documentNumber', 'documentType'])
export default class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  documentNumber: string;

  @Column({ enum: documentTypes })
  documentType: documentTypes;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.enterprise)
  users: User[];
}
