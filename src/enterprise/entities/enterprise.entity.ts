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

  @Column({ enum: StatusEntity, default: StatusEntity.PENDING_APPROVAL })
  status: StatusEntity;

  @OneToMany(() => User, (user) => user.enterprise)
  users: User[];
}
