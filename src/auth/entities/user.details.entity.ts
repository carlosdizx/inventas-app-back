import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypeDocument } from '../enums/user.type.document.enum';
import User from './user.entity';

@Entity('user_details')
export default class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  documentNumber: string;

  @Column({ enum: UserTypeDocument })
  documentType: UserTypeDocument;

  @Column()
  phone: string;

  @Column()
  gender: boolean;

  @Column({ type: 'date' })
  birthdate: Date;

  @OneToOne(() => User, (user) => user.userDetails)
  user: User;
}
