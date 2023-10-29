import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { documentTypes } from '../../common/enums/document.type.enum';

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
}
